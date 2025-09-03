import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HeatmapData {
  date: Date
  count: number
  day: number
  week: number
}

interface ResearchHeatmapProps {
  width?: number
  height?: number
}

export function ResearchHeatmap({ width = 800, height = 200 }: ResearchHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = []
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 364) // Last 52 weeks

    let currentDate = new Date(startDate)
    let week = 0
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()
      
      // Generate realistic paper counts
      let baseCount = Math.random() * 50
      
      // Fewer papers on weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        baseCount *= 0.2
      }
      
      // Seasonal patterns - less in summer and holidays
      const month = currentDate.getMonth()
      if (month === 6 || month === 7 || month === 11) { // July, August, December
        baseCount *= 0.6
      }
      
      // Some random spikes for conferences
      if (Math.random() < 0.05) {
        baseCount *= 2.5
      }

      data.push({
        date: new Date(currentDate),
        count: Math.round(baseCount),
        day: dayOfWeek,
        week: week
      })

      currentDate.setDate(currentDate.getDate() + 1)
      if (dayOfWeek === 6) week++ // New week on Sunday
    }

    return data
  }

  useEffect(() => {
    if (!svgRef.current) return

    const data = generateHeatmapData()
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 20, bottom: 30, left: 50 }
    const cellSize = 12
    const cellPadding = 2
    
    const weeksInYear = 53
    const daysInWeek = 7
    
    const actualWidth = weeksInYear * (cellSize + cellPadding) + margin.left + margin.right
    const actualHeight = daysInWeek * (cellSize + cellPadding) + margin.top + margin.bottom

    svg
      .attr('width', actualWidth)
      .attr('height', actualHeight)

    const container = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Color scale
    const maxCount = d3.max(data, d => d.count) || 0
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxCount])

    // Group data by week
    const weekData = d3.group(data, d => Math.floor((d.date.getTime() - data[0].date.getTime()) / (7 * 24 * 60 * 60 * 1000)))

    // Create cells
    weekData.forEach((weekDays, weekIndex) => {
      weekDays.forEach(dayData => {
        const dayOfWeek = dayData.date.getDay()
        
        container.append('rect')
          .attr('x', weekIndex * (cellSize + cellPadding))
          .attr('y', dayOfWeek * (cellSize + cellPadding))
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('rx', 2)
          .attr('fill', dayData.count === 0 ? '#f3f4f6' : colorScale(dayData.count))
          .attr('stroke', '#fff')
          .attr('stroke-width', 1)
          .style('cursor', 'pointer')
          .on('mouseover', function(event, d) {
            // Tooltip
            const tooltip = d3.select('body').append('div')
              .attr('class', 'heatmap-tooltip')
              .style('position', 'absolute')
              .style('background', 'rgba(0,0,0,0.9)')
              .style('color', 'white')
              .style('padding', '8px 12px')
              .style('border-radius', '6px')
              .style('font-size', '12px')
              .style('pointer-events', 'none')
              .style('z-index', '1000')
              .html(`
                <strong>${dayData.count} papers</strong><br/>
                ${d3.timeFormat('%B %d, %Y')(dayData.date)}
              `)
            
            tooltip
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px')
              .style('opacity', 0)
              .transition()
              .duration(200)
              .style('opacity', 1)

            // Highlight cell
            d3.select(this)
              .transition()
              .duration(100)
              .attr('stroke', '#374151')
              .attr('stroke-width', 2)
          })
          .on('mouseout', function() {
            d3.selectAll('.heatmap-tooltip').remove()
            
            d3.select(this)
              .transition()
              .duration(100)
              .attr('stroke', '#fff')
              .attr('stroke-width', 1)
          })
      })
    })

    // Add day labels
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    container.selectAll('.day-label')
      .data(dayLabels)
      .enter()
      .append('text')
      .attr('class', 'day-label')
      .attr('x', -10)
      .attr('y', (d, i) => i * (cellSize + cellPadding) + cellSize / 2)
      .attr('dy', '0.35em')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .text(d => d)

    // Add month labels
    const months = []
    let currentMonth = data[0].date.getMonth()
    let currentWeek = 0
    
    data.forEach((d, i) => {
      const month = d.date.getMonth()
      const week = Math.floor(i / 7)
      
      if (month !== currentMonth && week !== currentWeek) {
        months.push({
          month: d3.timeFormat('%b')(d.date),
          week: week
        })
        currentMonth = month
        currentWeek = week
      }
    })

    container.selectAll('.month-label')
      .data(months)
      .enter()
      .append('text')
      .attr('class', 'month-label')
      .attr('x', d => d.week * (cellSize + cellPadding))
      .attr('y', -5)
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .text(d => d.month)

    // Add legend
    const legendWidth = 100
    const legendHeight = 10
    const legendX = actualWidth - legendWidth - margin.right - 20
    const legendY = actualHeight - margin.bottom - 20

    const legendScale = d3.scaleLinear()
      .domain([0, maxCount])
      .range([0, legendWidth])

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(3)
      .tickSize(3)

    // Legend gradient
    const legendGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%')

    const legendStops = d3.range(0, 1.1, 0.1)
    legendGradient.selectAll('stop')
      .data(legendStops)
      .enter()
      .append('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => colorScale(d * maxCount))

    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', 'url(#legend-gradient)')
      .attr('stroke', '#d1d5db')

    svg.append('g')
      .attr('transform', `translate(${legendX}, ${legendY + legendHeight})`)
      .call(legendAxis)
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#6b7280')

    svg.append('text')
      .attr('x', legendX - 5)
      .attr('y', legendY + legendHeight / 2)
      .attr('dy', '0.35em')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .text('Less')

    svg.append('text')
      .attr('x', legendX + legendWidth + 5)
      .attr('y', legendY + legendHeight / 2)
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .text('More')

  }, [width, height])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Activity Heatmap</CardTitle>
        <p className="text-sm text-muted-foreground">
          Daily publication activity over the past year • Hover for details
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg ref={svgRef} className="w-full"></svg>
        </div>
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>• Each square represents one day</p>
          <p>• Darker colors indicate more papers published</p>
          <p>• Notice the weekend and holiday patterns</p>
        </div>
      </CardContent>
    </Card>
  )
}