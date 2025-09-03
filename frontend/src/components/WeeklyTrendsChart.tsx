import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DataPoint {
  date: Date
  category: string
  count: number
}

interface WeeklyTrendsChartProps {
  width?: number
  height?: number
}

export function WeeklyTrendsChart({ width = 800, height = 400 }: WeeklyTrendsChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Generate mock data for the past 7 days
  const generateMockData = (): DataPoint[] => {
    const categories = [
      { id: 'cs.LG', name: 'Machine Learning', color: '#3b82f6' },
      { id: 'cs.AI', name: 'AI', color: '#ef4444' },
      { id: 'cs.CV', name: 'Computer Vision', color: '#22c55e' },
      { id: 'quant-ph', name: 'Quantum Physics', color: '#a855f7' },
      { id: 'math.ST', name: 'Statistics', color: '#f59e0b' },
    ]

    const data: DataPoint[] = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      categories.forEach(category => {
        // Generate realistic paper counts with some randomness
        let baseCount = 0
        switch (category.id) {
          case 'cs.LG': baseCount = 45 + Math.random() * 20; break
          case 'cs.AI': baseCount = 35 + Math.random() * 15; break
          case 'cs.CV': baseCount = 25 + Math.random() * 12; break
          case 'quant-ph': baseCount = 15 + Math.random() * 8; break
          case 'math.ST': baseCount = 20 + Math.random() * 10; break
        }
        
        // Add some weekly patterns (less on weekends)
        const dayOfWeek = date.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          baseCount *= 0.3 // Much fewer papers on weekends
        }
        
        data.push({
          date: new Date(date),
          category: category.id,
          count: Math.round(baseCount)
        })
      })
    }
    
    return data
  }

  const categoryInfo = {
    'cs.LG': { name: 'Machine Learning', color: '#3b82f6' },
    'cs.AI': { name: 'AI', color: '#ef4444' },
    'cs.CV': { name: 'Computer Vision', color: '#22c55e' },
    'quant-ph': { name: 'Quantum Physics', color: '#a855f7' },
    'math.ST': { name: 'Statistics', color: '#f59e0b' },
  }

  useEffect(() => {
    if (!svgRef.current) return

    const data = generateMockData()
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 120, bottom: 40, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) as number])
      .nice()
      .range([innerHeight, 0])

    // Line generator
    const line = d3.line<DataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.count))
      .curve(d3.curveCardinal.tension(0.3))

    // Group data by category
    const groupedData = d3.group(data, d => d.category)

    // Create gradient definitions
    const defs = svg.append('defs')
    Object.entries(categoryInfo).forEach(([categoryId, info]) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${categoryId}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0).attr('y1', innerHeight)
        .attr('x2', 0).attr('y2', 0)
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', info.color)
        .attr('stop-opacity', 0.1)
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', info.color)
        .attr('stop-opacity', 0.3)
    })

    // Add grid lines
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%a %d'))
      .ticks(7)

    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(d => `${d}`)

    // Add axes
    container.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6b7280')

    container.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6b7280')

    // Style grid lines
    container.selectAll('.y-axis .tick line')
      .style('stroke', '#e5e7eb')
      .style('stroke-dasharray', '2,2')

    // Remove axis domain lines
    container.selectAll('.domain').remove()

    // Area generator for fill
    const area = d3.area<DataPoint>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(d.count))
      .curve(d3.curveCardinal.tension(0.3))

    // Draw areas (fill under lines)
    groupedData.forEach((categoryData, categoryId) => {
      const sortedData = categoryData.sort((a, b) => a.date.getTime() - b.date.getTime())
      
      container.append('path')
        .datum(sortedData)
        .attr('fill', `url(#gradient-${categoryId})`)
        .attr('d', area)
    })

    // Draw lines
    groupedData.forEach((categoryData, categoryId) => {
      const sortedData = categoryData.sort((a, b) => a.date.getTime() - b.date.getTime())
      const info = categoryInfo[categoryId as keyof typeof categoryInfo]
      
      container.append('path')
        .datum(sortedData)
        .attr('fill', 'none')
        .attr('stroke', info.color)
        .attr('stroke-width', 3)
        .attr('d', line)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
    })

    // Add dots for data points
    groupedData.forEach((categoryData, categoryId) => {
      const info = categoryInfo[categoryId as keyof typeof categoryInfo]
      
      container.selectAll(`.dot-${categoryId}`)
        .data(categoryData)
        .enter().append('circle')
        .attr('class', `dot-${categoryId}`)
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.count))
        .attr('r', 4)
        .attr('fill', info.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))')
        .on('mouseover', function(event, d) {
          // Tooltip on hover
          const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.8)')
            .style('color', 'white')
            .style('padding', '8px 12px')
            .style('border-radius', '6px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '1000')
            .html(`
              <strong>${info.name}</strong><br/>
              ${d3.timeFormat('%B %d, %Y')(d.date)}<br/>
              ${d.count} papers
            `)
          
          tooltip
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1)
        })
        .on('mouseout', function() {
          d3.selectAll('.tooltip').remove()
        })
    })

    // Add legend
    const legend = container.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth + 20}, 20)`)

    Object.entries(categoryInfo).forEach(([categoryId, info], index) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${index * 25})`)

      legendItem.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', info.color)
        .attr('stroke-width', 3)

      legendItem.append('circle')
        .attr('cx', 10)
        .attr('cy', 0)
        .attr('r', 4)
        .attr('fill', info.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)

      legendItem.append('text')
        .attr('x', 30)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', '#374151')
        .text(info.name)
    })

    // Add axis labels
    container.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#6b7280')
      .text('Papers Published')

    container.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#6b7280')
      .text('Date')

  }, [width, height])

  // Calculate totals for the week
  const data = generateMockData()
  const weeklyTotals = d3.rollup(
    data,
    v => d3.sum(v, d => d.count),
    d => d.category
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Weekly Publication Trends</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Papers published per day over the last 7 days
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(weeklyTotals.entries()).map(([category, total]) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {categoryInfo[category as keyof typeof categoryInfo].name}: {total}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef} className="w-full"></svg>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>• Hover over data points for detailed information</p>
          <p>• Weekend publication rates are typically lower</p>
        </div>
      </CardContent>
    </Card>
  )
}