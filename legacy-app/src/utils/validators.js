// Form validation functions
// TODO: clean up these regexes, some are probably wrong

/**
 * Validate email address
 * NOTE: this regex is not perfect but works for most cases
 */
export function validateEmail(email) {
  if (!email) return false;
  // eslint-disable-next-line
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

/**
 * Validate phone number - accepts various formats
 */
export function validatePhone(phone) {
  if (!phone) return false;
  // remove spaces, dashes, parentheses
  var cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // check if it's 10-13 digits (with optional +)
  var regex = /^\+?[0-9]{10,13}$/;
  return regex.test(cleaned);
}

/**
 * Validate password strength
 * Returns object with score and message
 */
export function validatePassword(password) {
  var result = {
    isValid: false,
    score: 0,
    message: '',
  };

  if (!password) {
    result.message = 'Password is required';
    return result;
  }

  if (password.length < 6) {
    result.message = 'Password must be at least 6 characters';
    result.score = 1;
    return result;
  }

  var score = 0;

  // length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // has uppercase
  if (/[A-Z]/.test(password)) score++;

  // has lowercase
  if (/[a-z]/.test(password)) score++;

  // has number
  if (/[0-9]/.test(password)) score++;

  // has special char
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  result.score = score;

  if (score < 3) {
    result.message = 'Weak password';
  } else if (score < 5) {
    result.message = 'Medium password';
    result.isValid = true;
  } else {
    result.message = 'Strong password';
    result.isValid = true;
  }

  return result;
}

/**
 * Validate URL
 */
export function validateURL(url) {
  if (!url) return false;
  // super basic URL check
  var regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return regex.test(url)
}

/**
 * Validate that a field is not empty
 */
export function validateRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Validate number is in range
 */
export function validateRange(value, min, max) {
  var num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
}

/**
 * Validate credit card number (basic Luhn check)
 * TODO: this is probably not complete
 */
export function validateCreditCard(number) {
  if (!number) return false;
  var cleaned = number.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  // luhn algorithm
  var sum = 0;
  var isEven = false;

  for (var i = cleaned.length - 1; i >= 0; i--) {
    var digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return (sum % 10) === 0;
}

/**
 * Validate a whole form object
 * rules is an object like: { email: { required: true, email: true }, name: { required: true, minLength: 2 } }
 */
export function validateForm(data, rules) {
  var errors = {};

  Object.keys(rules).forEach(function(field) {
    var rule = rules[field];
    var value = data[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = field + ' is required';
      return;
    }

    if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
      return;
    }

    if (rule.phone && value && !validatePhone(value)) {
      errors[field] = 'Invalid phone number';
      return;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = 'Must be at least ' + rule.minLength + ' characters';
      return
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = 'Must be no more than ' + rule.maxLength + ' characters';
      return
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors,
  };
}

// export as default too for backward compat
export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateURL,
  validateRequired,
  validateRange,
  validateCreditCard,
  validateForm,
};
