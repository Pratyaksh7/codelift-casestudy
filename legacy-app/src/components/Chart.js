import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './Chart.css';

// Fake chart component using inline styles and jQuery animations
// TODO: replace with a real charting library like Chart.js or Recharts
class Chart extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.state = {
      animated: false,
      hoveredBar: null,
    };
    // intentional: interval not cleaned up
    this.refreshInterval = null;
  }

  componentDidMount() {
    this.animateBars();

    // periodically "refresh" the chart - intentional memory leak
    var self = this;
    this.refreshInterval = setInterval(function() {
      console.log('[Chart] Auto-refresh tick (this is wasteful)');
    }, 30000);
  }

  // memory leak: not clearing interval
  // componentWillUnmount() {
  //   clearInterval(this.refreshInterval);
  // }

  animateBars() {
    var self = this;
    setTimeout(function() {
      var $bars = $(self.chartRef.current).find('.chart-bar-fill');
      $bars.each(function(index) {
        var $bar = $(this);
        var targetHeight = $bar.attr('data-height');
        $bar.css('height', 0);
        $bar.delay(index * 100).animate({ height: targetHeight + '%' }, 600);
      });
      self.setState({ animated: true });
    }, 200);
  }

  handleBarHover = (index) => {
    this.setState({ hoveredBar: index });
  }

  handleBarLeave = () => {
    this.setState({ hoveredBar: null });
  }

  renderBarChart() {
    var { data, barColor, height } = this.props;
    var { hoveredBar } = this.state;

    if (!data || data.length === 0) return <p style={{color: '#888'}}>No data</p>;

    var maxValue = Math.max.apply(null, data.map(function(d) { return d.value; }));
    var chartHeight = height || 200;

    return (
      <div className="chart-bar-container" style={{ height: chartHeight }}>
        {data.map(function(item, index) {
          var barHeight = (item.value / maxValue) * 100;
          var isHovered = hoveredBar === index;

          return (
            <div
              key={index}
              className="chart-bar-wrapper"
              onMouseEnter={function() { this.handleBarHover(index); }.bind(this)}
              onMouseLeave={this.handleBarLeave}
            >
              {isHovered && (
                <div className="chart-tooltip">
                  <strong>{item.label}</strong><br />
                  {item.value.toLocaleString()}
                </div>
              )}
              <div className="chart-bar">
                <div
                  className="chart-bar-fill"
                  data-height={barHeight}
                  style={{
                    backgroundColor: barColor || '#4a90d9',
                    opacity: isHovered ? 1 : 0.85,
                    height: this.state.animated ? barHeight + '%' : 0,
                  }}
                ></div>
              </div>
              <span className="chart-bar-label">{item.label}</span>
            </div>
          );
        }.bind(this))}
      </div>
    );
  }

  renderLineChart() {
    var { data, lineColor, height } = this.props;

    if (!data || data.length === 0) return <p style={{color: '#888'}}>No data</p>;

    var maxValue = Math.max.apply(null, data.map(function(d) { return d.value; }));
    var chartHeight = height || 200;

    // fake line chart using absolute positioned dots and connecting lines
    return (
      <div className="chart-line-container" style={{ height: chartHeight, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox={'0 0 ' + (data.length * 60) + ' ' + chartHeight}>
          {/* Draw line path */}
          <polyline
            fill="none"
            stroke={lineColor || '#4a90d9'}
            strokeWidth="2"
            points={data.map(function(item, index) {
              var x = index * 60 + 30;
              var y = chartHeight - (item.value / maxValue) * (chartHeight - 40) - 20;
              return x + ',' + y;
            }).join(' ')}
          />
          {/* Draw dots */}
          {data.map(function(item, index) {
            var x = index * 60 + 30;
            var y = chartHeight - (item.value / maxValue) * (chartHeight - 40) - 20;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={lineColor || '#4a90d9'}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="chart-line-labels" style={{ display: 'flex' }}>
          {data.map(function(item, index) {
            return (
              <span key={index} className="chart-bar-label" style={{ width: 60, textAlign: 'center' }}>
                {item.label}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  renderDonutChart() {
    var { data, height } = this.props;

    if (!data || data.length === 0) return <p style={{color: '#888'}}>No data</p>;

    var size = height || 200;
    var total = data.reduce(function(sum, d) { return sum + d.value; }, 0);
    var colors = ['#4a90d9', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];

    // fake donut using conic-gradient background
    var gradientParts = [];
    var currentAngle = 0;
    data.forEach(function(item, index) {
      var percentage = (item.value / total) * 100;
      var color = colors[index % colors.length];
      gradientParts.push(color + ' ' + currentAngle + '% ' + (currentAngle + percentage) + '%');
      currentAngle += percentage;
    });

    return (
      <div className="chart-donut-container">
        <div
          className="chart-donut"
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'conic-gradient(' + gradientParts.join(', ') + ')',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size * 0.55,
            height: size * 0.55,
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 700,
            color: '#2c3e50',
          }}>
            {total.toLocaleString()}
          </div>
        </div>
        <div className="chart-donut-legend">
          {data.map(function(item, index) {
            return (
              <div key={index} className="chart-legend-item">
                <span className="chart-legend-color" style={{ backgroundColor: colors[index % colors.length] }}></span>
                <span className="chart-legend-label">{item.label}</span>
                <span className="chart-legend-value">{item.value.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    var { title, type } = this.props;

    return (
      <div className="chart-component" ref={this.chartRef}>
        {title && <h4 className="chart-title">{title}</h4>}
        {type === 'line' ? this.renderLineChart() :
         type === 'donut' ? this.renderDonutChart() :
         this.renderBarChart()}
      </div>
    );
  }
}

Chart.propTypes = {
  type: PropTypes.oneOf(['bar', 'line', 'donut']),
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })),
  title: PropTypes.string,
  height: PropTypes.number,
  barColor: PropTypes.string,
  lineColor: PropTypes.string,
}

export default Chart;
