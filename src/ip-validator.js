function validateIPAddress(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;
    if (ipv4Regex.test(ip)) {
      return ip.split('.').every(part => parseInt(part) <= 255);
    }
    if (ipv6Regex.test(ip)) {
      return ip.split(':').every(part => part.length <= 4);
    }
    return false;
  }

exports.validateIPAddress = validateIPAddress;