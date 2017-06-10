var React = require('react');
var d3 = require('d3');

var MACircleScore = React.createClass({
  propTypes: {
    radius: React.PropTypes.number,
    score: React.PropTypes.number,
    thickness: React.PropTypes.number,
    foregroundColorFill: React.PropTypes.string,
    backgroundColorFill: React.PropTypes.string,
    textClass: React.PropTypes.string,
    format: React.PropTypes.func,
    cls: React.PropTypes.string.isRequired
  },

  getDefaultProps: function () {
    return {
      score: 0,
      radius: 75,
      thickness: 10,
      foregroundColorFill: "RGB(255, 152, 0)", // #FF9800
      backgroundColorFill: "RGB(97, 97, 97)", //#616161
      textClass: "w3-xlarge",
      format: d3.format('.0%')
    };
  },

  componentDidMount: function () {
    this.drawCircleScore();
    window.addEventListener('resize', this.resizeHandler)
  },

  resizeHandler: function () {
    this.redrawCircleScore();
  },

  drawCircle: function (radius) {
    return d3.arc()
      .innerRadius(radius - this.props.thickness)
      .outerRadius(radius)
      .startAngle(0);
  },

  drawCircleScore: function () {
    const decScore = this.props.score / 100;
    const radius = Math.min(this.props.radius, this.refs.circle.offsetWidth / 2);
    //const radius = this.props.radius
    const tau = Math.PI * 2;
    const circle = d3.select(this.refs.circle).append('svg')
      .attr('width', radius * 2)
      .attr('height', radius * 2)
      .attr('class', this.props.cls)
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`);

    // Add background
    circle.append('path')
      .datum({endAngle: tau})
      .attr('fill', this.props.backgroundColorFill)
      .attr('stroke-linecap', "round")
      .attr('d', this.drawCircle(radius));

    // Add foreground
    circle.append('path')
      .datum({endAngle: tau * decScore})
      .attr('fill', this.props.foregroundColorFill)
      .attr('stroke-linecap', "round")
      .attr('d', this.drawCircle(radius));

    // Add label
    circle.append('text')
      .text(this.props.format(decScore))
      .attr('class', this.props.textClass)
      .attr('fill', this.props.foregroundColorFill)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle');
  },

  redrawCircleScore: function () {
    const selector = "svg." + this.props.cls;
    d3.select(selector).remove();
    this.drawCircleScore();
  },

  render: function () {
    return (
      <div ref="circle"></div>
    );
  }
});

module.exports = MACircleScore;
