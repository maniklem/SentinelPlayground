import React from 'react';
import { LocationSearchBox } from 'eo-components';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchVisible: false
    };
    this.highlightedBgColor = '#c9ced4';
    this.inputWrapperStyle = {
      fontSize: '1rem',
      position: 'relative',
      width: 130,
      margin: '0 auto',
      textAlign: 'left',
      display: 'inline-block',
      verticalAlign: 'middle',
      zIndex: 10,
      transition: 'width .1s ease'
    };
    this.menuStyle = {
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: '#2f485c',
      color: 'white',
      zIndex: 9999,
      fontSize: '90%',
      position: 'absolute',
      maxHeight: '300px',
      top: 39,
      left: 0,
      lineHeight: '24px'
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize(nextToolsVisible = null) {
    let toolsVisible = null;
    try {
      toolsVisible = this.props.toolsVisible;
    } catch (e) {}

    if (toolsVisible === null) return;

    if (nextToolsVisible !== null) {
      toolsVisible = nextToolsVisible;
    }

    let baseWidth = 130; // bottom equation for width 130 !!!.. non-parametrized :(
    let viewport = window.innerWidth;
    let searchBox = document.querySelector('#searchBox .geosuggest');

    if (searchBox === null) return;

    if (viewport > 700 && viewport < 811 && toolsVisible) {
      // f(x)   = k*x + n
      // f(700) = k*700 + n = 40
      // f(810) = k*810 + n = 130
      // wolframalpha to the rescue :)
      // https://www.wolframalpha.com/input/?i=k*700+%2B+n%3D+40,+k*810+%2B+n+%3D+130
      // as of 23.03.2017
      // k = 9/11, n = -5860/11
      let newWidth = (9 / 11) * viewport + -5860 / 11;
      newWidth = Math.floor(newWidth);

      searchBox.style.width = newWidth + 'px';
    } else {
      searchBox.style.width = `${baseWidth}px`;
    }
  }

  componentWillUpdate(nextProps, nextSize) {
    let nextToolsVisible = nextProps.toolsVisible;

    if (nextToolsVisible) {
      this.handleResize(nextProps.toolsVisible);
    } else {
      setTimeout(() => {
        this.handleResize();
      }, 700); // transition is of the same speed as #tools
    }
  }

  render() {
    return (
      <div id="searchBox" className={(this.state.isSearchVisible && 'active') + ' floatItem'}>
        <i
          onClick={() => {
            this.setState({ isSearchVisible: !this.state.isSearchVisible });
          }}
          className="fa fa-search"
        />
        <span>
          <LocationSearchBox
            inputWrapperStyle={this.inputWrapperStyle}
            highlightedBgColor={this.highlightedBgColor}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            placeholder="Go to Place"
            minChar={4}
            onSelect={this.props.onLocationPicked}
            slim={true}
            menuStyle={this.menuStyle}
          />
        </span>
      </div>
    );
  }
}

export default SearchBox;
