import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { DonutChartData } from '../../types';

interface DonutChartProps {
  data: DonutChartData;
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    if (chartWrapperRef.current) {
      resizeObserver.observe(chartWrapperRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);
  
  useEffect(() => {
    if (!data || data.slices.length === 0 || dimensions.width === 0 || !chartWrapperRef.current || !legendRef.current || !tooltipRef.current) {
        return;
    }

    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2.5;
    
    const svg = d3.select(chartWrapperRef.current).select('svg')
      .attr('width', width)
      .attr('height', height);

    let g = svg.select<SVGGElement>('g.chart-group');
    if (g.empty()) {
        g = svg.append('g').attr('class', 'chart-group');
    }
    g.attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const total = d3.sum(data.slices, d => d.value);

    const pie = d3.pie<{ label: string; value: number }>()
      .sort(null)
      .value(d => d.value);

    const pathGenerator = d3.arc<any, d3.PieArcDatum<{ label: string; value: number }>>()
      .outerRadius(radius)
      .innerRadius(radius * 0.6);

    // Slices Data Join
    g.selectAll('path')
      .data(pie(data.slices), (d: any) => d.data.label)
      .join(
        enter => enter.append('path')
          .attr('fill', d => color(d.data.label))
          .style('cursor', 'pointer')
          .each(function(d) { (this as any)._current = d; })
          .on('mouseover', function(event, d) {
            d3.select(this).transition().duration(200).attr('transform', 'scale(1.05)');
            const percentage = ((d.data.value / total) * 100).toFixed(1);
            d3.select(tooltipRef.current)
              .style('opacity', 1)
              .html(`<strong>${d.data.label}</strong><br/>Valore: ${d.data.value}<br/>Percentuale: ${percentage}%`)
              .style('left', `${event.pageX + 15}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', function() {
            d3.select(this).transition().duration(200).attr('transform', 'scale(1)');
            d3.select(tooltipRef.current).style('opacity', 0);
          })
          .transition()
          .duration(750)
          .attrTween('d', function(d) {
              const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
              return (t) => pathGenerator(i(t))!;
          }),
        update => update
          .transition()
          .duration(750)
          .attrTween('d', function(d) {
              const i = d3.interpolate((this as any)._current, d);
              // FIX: Correctly update _current to the new datum `d` for subsequent transitions.
              (this as any)._current = d;
              return (t) => pathGenerator(i(t))!;
          }),
        exit => exit.transition().duration(750).attrTween('d', function() {
            // FIX: The end-state for interpolation must be a valid PieArcDatum object.
            // We create a copy of the current state and collapse its angles to create a zero-width arc for the exit animation.
            const d = (this as any)._current;
            const i = d3.interpolate(d, { ...d, startAngle: d.endAngle, endAngle: d.endAngle });
            return (t) => pathGenerator(i(t))!;
        }).remove()
      );
      
    // Legend
    const legend = d3.select(legendRef.current);
    legend.selectAll('*').remove(); // Simple legend redraw

    data.slices.forEach(slice => {
        const percentage = total > 0 ? ((slice.value / total) * 100).toFixed(1) : 0;
        const item = legend.append('div').attr('class', 'flex items-center mb-1 text-xs');
        item.append('div')
            .attr('class', 'w-3 h-3 rounded-full mr-2 flex-shrink-0')
            .style('background-color', color(slice.label));
        item.append('span')
            .attr('class', 'font-semibold text-gray-700 truncate')
            .attr('title', `${slice.label} (${percentage}%)`)
            .text(`${slice.label} (${percentage}%)`);
    });

  }, [data, dimensions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center w-full min-h-[250px]" ref={containerRef}>
        <div 
            ref={tooltipRef} 
            className="absolute p-2 text-xs bg-gray-800 text-white rounded-md pointer-events-none transition-opacity duration-200 opacity-0 z-10"
        ></div>
        <div ref={chartWrapperRef} className="relative w-full h-full min-h-[200px] md:min-h-0">
            <svg className="absolute top-0 left-0 w-full h-full" />
        </div>
        <div ref={legendRef} className="p-2 md:p-4 self-center max-h-[250px] overflow-y-auto md:border-l md:border-gray-200"></div>
    </div>
  );
};

export default DonutChart;