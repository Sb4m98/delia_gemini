import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { BarChartData } from '../../types';

interface BarChartProps {
  data: BarChartData;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        const { width } = entries[0].contentRect;
        setDimensions({ width, height: Math.max(250, width * 0.6) }); // Maintain aspect ratio with a min height
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!data || data.labels.length === 0 || dimensions.width === 0 || !svgRef.current) {
        return;
    }
    
    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 80, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);
    
    let g = svg.select<SVGGElement>('g.chart-content');
    if (g.empty()) {
        g = svg.append('g').attr('class', 'chart-content');
    }
    g.attr('transform', `translate(${margin.left},${margin.top})`);
    
    let xAxisG = g.select<SVGGElement>('.x-axis');
    if (xAxisG.empty()) {
        xAxisG = g.append('g').attr('class', 'x-axis');
    }
    xAxisG.attr('transform', `translate(0,${innerHeight})`);

    let yAxisG = g.select<SVGGElement>('.y-axis');
    if (yAxisG.empty()) {
        yAxisG = g.append('g').attr('class', 'y-axis');
    }
    
    const x = d3.scaleBand()
        .domain(data.labels)
        .range([0, innerWidth])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data.values, d => d) as number])
        .nice()
        .range([innerHeight, 0]);

    // X axis
    xAxisG.transition().duration(750).call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em');
    
    // Y axis
    yAxisG.transition().duration(750).call(d3.axisLeft(y));

    const chartData = data.labels.map((label, i) => ({ label, value: data.values[i] }));

    // Bars Data Join
    g.selectAll('.bar')
      // FIX: Explicitly type the datum `d` in the key function to resolve the TypeScript error.
      .data(chartData, (d: { label: string; value: number; }) => d.label)
      .join(
        enter => enter.append('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.label)!)
          .attr('y', innerHeight)
          .attr('width', x.bandwidth())
          .attr('height', 0)
          .attr('fill', 'rgb(124, 58, 173)')
          .style('cursor', 'pointer')
          .on('mouseover', function(event, d) {
             d3.select(this).attr('fill', 'rgb(88, 28, 135)');
             d3.select(tooltipRef.current)
                .style('opacity', 1)
                .html(`<strong>${d.label}</strong><br/>Valore: ${d.value}`)
                .style('left', `${event.pageX + 15}px`)
                .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', function() {
            d3.select(this).attr('fill', 'rgb(124, 58, 173)');
            d3.select(tooltipRef.current).style('opacity', 0);
          })
          .call(enter => enter.transition().duration(750)
            .attr('y', d => y(d.value))
            .attr('height', d => innerHeight - y(d.value))
          ),
        update => update
          .call(update => update.transition().duration(750)
            .attr('x', d => x(d.label)!)
            .attr('y', d => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', d => innerHeight - y(d.value))
          ),
        exit => exit
          .call(exit => exit.transition().duration(750)
            .attr('y', innerHeight)
            .attr('height', 0)
            .remove()
          )
      );

  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
        <div 
            ref={tooltipRef} 
            className="absolute p-2 text-xs bg-gray-800 text-white rounded-md pointer-events-none transition-opacity duration-200 opacity-0 z-10"
        ></div>
        <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;