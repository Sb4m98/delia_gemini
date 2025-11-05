import React, { memo } from 'react';
import type { ChatMessage, ChartResponse } from '../../types';
import MarkdownRenderer from './MarkdownRenderer';
import DonutChart from '../charts/DonutChart';
import BarChart from '../charts/BarChart';

interface ChatMessageUIProps {
  message?: ChatMessage;
  isLoading?: boolean;
}

const tryParseChart = (text: string): ChartResponse | null => {
    let jsonString = text.trim();
    
    // Handle markdown code blocks
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.substring(3, jsonString.length - 3).trim();
    }

    try {
        const parsed = JSON.parse(jsonString);
        if (
            parsed.type === 'chart' &&
            (parsed.chartType === 'donut' || parsed.chartType === 'bar') &&
            parsed.title &&
            parsed.data
        ) {
            return parsed as ChartResponse;
        }
    } catch (e) {
        // Not a valid JSON or not a chart object
    }
    return null;
};


const ChatMessageUI: React.FC<ChatMessageUIProps> = ({ message, isLoading }) => {
  const role = message?.role ?? 'assistant';
  const content = message?.content ?? '';

  if (isLoading) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-purple-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          AI
        </div>
        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const chartData = tryParseChart(content);

  return (
    <div className={`flex items-start gap-3 ${role === 'user' ? 'justify-end' : ''}`}>
      {role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-purple-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          AI
        </div>
      )}
      <div
        className={`p-4 rounded-2xl shadow-sm ${
          role === 'user'
            ? 'bg-brand-purple text-white rounded-br-none max-w-lg'
            : 'bg-gray-100 text-gray-800 rounded-bl-none max-w-lg lg:max-w-2xl xl:max-w-4xl'
        }`}
      >
        <div className="text-sm">
             {chartData ? (
                <div className="bg-white rounded-lg p-2 min-w-[400px] md:min-w-[600px]">
                    <h3 className="text-base font-bold text-center text-gray-800 mb-2">{chartData.title}</h3>
                    {chartData.chartType === 'donut' && <DonutChart data={chartData.data as any} />}
                    {chartData.chartType === 'bar' && <BarChart data={chartData.data as any} />}
                </div>
             ) : (
                <MarkdownRenderer content={content} />
             )}
        </div>
      </div>
      {role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-brand-purple-dark font-bold text-sm flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
};

export default memo(ChatMessageUI);
