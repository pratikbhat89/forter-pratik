const { validateIPAddress } = require('../src/ip-validator');

describe('validateIPAddress', () => {
  // Test cases for IPv4 addresses
  test('should return true for valid IPv4 address', () => {
    expect(validateIPAddress('192.168.1.1')).toBe(true);
    expect(validateIPAddress('0.0.0.0')).toBe(true);
    expect(validateIPAddress('255.255.255.255')).toBe(true);
  });

  test('should return false for invalid IPv4 address', () => {
    expect(validateIPAddress('256.256.256.256')).toBe(false);
    expect(validateIPAddress('192.168.1')).toBe(false);
    expect(validateIPAddress('192.168.1.999')).toBe(false);
    expect(validateIPAddress('192.168.1.1.1')).toBe(false);
  });

  // Test cases for IPv6 addresses
  test('should return true for valid IPv6 address', () => {
    expect(validateIPAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
    expect(validateIPAddress('2001:db8:85a3:0:0:8a2e:370:7334')).toBe(true);
  });

  test('should return false for invalid IPv6 address', () => {
    expect(validateIPAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334:1234')).toBe(false);
    expect(validateIPAddress('2001:db8:85a3:0:0:8a2e:370')).toBe(false);
  });

  // Test cases for invalid IP addresses
  test('should return false for non-IP strings', () => {
    expect(validateIPAddress('not-an-ip')).toBe(false);
    expect(validateIPAddress('192.168.1.1a')).toBe(false);
    expect(validateIPAddress('12345')).toBe(false); 
  });
});
