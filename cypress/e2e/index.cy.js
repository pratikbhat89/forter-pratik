describe('API End-to-End Tests', () => {
  const baseUrl = 'http://localhost:3000';

  before(() => {
    cy.wait(5000); 
  });

  it('should return the country for a valid IP address', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/ip-to-country/8.8.8.8`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('country');
      expect(response.body.country).to.be.a('string');
    });
  });

  it('should return an error for an invalid IP address', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/ip-to-country/invalid-ip`,
      failOnStatusCode: false, // Handle non-200 responses
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'Invalid IP address');
    });
  });

});
