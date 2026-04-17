import React, { Component, createContext } from 'react';
import { connect } from 'react-redux';
import { THEMES, STORAGE_KEYS } from '../utils/constants';

// Create context
// TODO: this is a weird mix of Context API and Redux - pick one!
export const ThemeContext = createContext({
  theme: THEMES.LIGHT,
  toggleTheme: function() {},
});

/**
 * Theme provider component
 * Uses React Context but also connects to Redux for some reason
 * This is intentionally inconsistent for the legacy feel
 */
class ThemeProviderClass extends Component {
  constructor(props) {
    super(props);

    // try to get theme from localStorage
    var savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

    this.state = {
      theme: savedTheme || THEMES.LIGHT,
    };
  }

  componentDidMount() {
    this.applyTheme(this.state.theme);
    console.log('[ThemeContext] Theme initialized:', this.state.theme);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.theme !== this.state.theme) {
      this.applyTheme(this.state.theme);
    }
  }

  applyTheme = (theme) => {
    // directly manipulate the DOM - not the React way but it works
    document.body.setAttribute('data-theme', theme);

    if (theme === THEMES.DARK) {
      document.body.style.backgroundColor = '#1a1a2e';
      document.body.style.color = '#e0e0e0';
    } else {
      document.body.style.backgroundColor = '#f4f6f9';
      document.body.style.color = '#333';
    }
  }

  toggleTheme = () => {
    var newTheme = this.state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    console.log('[ThemeContext] Switching theme to:', newTheme);

    this.setState({ theme: newTheme });
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  }

  render() {
    var contextValue = {
      theme: this.state.theme,
      toggleTheme: this.toggleTheme,
      isDark: this.state.theme === THEMES.DARK,
    };

    return (
      <ThemeContext.Provider value={contextValue}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

// connect to Redux even though we don't really need to
// this is the "legacy inconsistency" - mixing patterns
var mapStateToProps = function(state) {
  return {
    user: state.auth.user,
  };
};

export const ThemeProvider = connect(mapStateToProps)(ThemeProviderClass);

// consumer helper
export const ThemeConsumer = ThemeContext.Consumer;

export default ThemeContext;
