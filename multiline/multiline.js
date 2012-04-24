// Mulit-Line Graph using s3.
// by Edd Sowden - e26.co.uk
// 24 April 2012

var multiLine = function(el, options){
  var padding = options.padding || 20,
      width = (options.width || 600) - padding * 2,
      height = (options.height || 200) - padding * 2,
      xTickCount = options.xTickCount || 10,
      yTickCount = options.yTickCount || 0,
      svg = d3.select(el)
        .append('svg:svg')
          .attr('width', (width + padding * 2))
          .attr('height', (height + padding * 2))
          .attr('class', 'multiLine')
        .append('g').attr('transform', 'translate('+padding+','+padding+')'),
      axis = svg.append('g').attr('class', 'axis'),
      axisCords = [
        // [ y1, y2, x1, x2 ]
        [ 0.5, width+.5, height+.5, height+.5 ],
        [ 0.5, 0.5, 0.5, height+.5 ],
        [ width+.5, width+.5, 0.5, height+.5 ]
      ],
      line, lines = {};

  drawTicks(options.labels);

  for(line in options.data){
    lines[line] = drawLine(line, options.data[line]);
  }
  axisCords.map(function(data){
    axis.append('svg:line')
        .attr('x1', data[0])
        .attr('x2', data[1])
        .attr('y1', data[2])
        .attr('y2', data[3]);
  });

  function drawLine(className, data){
    var plot = svg.append('g').attr('class', 'line-plot '+className).data([data]),
        max = d3.max(data),
        // data.length - 1 because we are plotting at the start of the x band
        x = d3.scale.linear().domain([0, data.length-1]).range([0, width]),
        // flipped range so zero is along the bottom
        y = d3.scale.linear().domain([0, max]).range([height, 0]).nice(),
        lines = plot.append('g'),
        line = d3.svg.line()
          .interpolate('linear')
          .x(function(d, i) { return x(i); })
          .y(function(d, i) { return y(d); }),
        linePath = lines.append('svg:path')
          .attr('d', line)
          .attr('class', 'line'),
        area = d3.svg.area()
          .interpolate('linear')
          .x(line.x())
          .y(line.y())
          .y0(y(0)),
        areaPath = lines.append('svg:path')
          .attr('d', area)
          .attr('class', 'area'),
        dots = plot.selectAll('circle')
            .data(data)
          .enter().append('circle')
            .attr('class', 'point')
            .attr('cx', line.x())
            .attr('cy', line.y())
            .attr('r', 2);
        axis = plot.append('g').attr('class', 'axis');

    dots.on('mouseover', function(d, i){
      tooltip(i, x(i), y(d))
    });

    return {
      update: function(data){
        y.domain([0, d3.max(data)]);
        linePath.data([data]).transition()
          .duration(500).attr('d', line);
        areaPath.data([data]).transition()
          .duration(500).attr('d', area);
        dots.data(data).transition()
          .duration(500).attr('cy', line.y());
      }
    }
  }
  function drawTicks(data){
    var x = d3.scale.linear().domain([0, data.length-1]).range([0, width]),
        ticks = x.ticks(xTickCount),
        y = d3.scale.linear().domain([0, yTickCount-1]).range([height, 0]);

    ticks.map(function(d){
      axis.append('svg:line')
          .attr('class', 'y-tick')
          .attr('x1', x(d)+.5)
          .attr('x2', x(d)+.5)
          .attr('y1', 0)
          .attr('y2', height);
      axis.append('svg:text')
          .text(data[d])
          .attr('text-anchor', 'middle')
          .attr('dx', x(d))
          .attr('dy', height)
          .attr('transform', 'translate(0,'+2*padding/3+')');
    });
    d3.range(xTickCount).map(function(d){
      axis.append('svg:line')
          .attr('class', 'x-tick')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', y(d)+.5)
          .attr('y2', y(d)+.5);
    });

  }
  function tooltip(index, x, y){
    var line;
    for(line in lines){
      if(window.console && console.log){
        console.log(line + ': '+ options.data[line][index]);
      }
    }
  }

  return {
    update: function(data){
      var line;
      for(line in data){
        lines[line].update(data[line]);
      }
    }
  }
}
