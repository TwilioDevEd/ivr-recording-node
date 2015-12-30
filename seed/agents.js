db.dropDatabase();

var agents = [
  { extension: 'Brodo',   phoneNumber: '+15552483591' },
  { extension: 'Dugobah', phoneNumber: '+15558675309' },
  { extension: '113',     phoneNumber: '+15553185602' }
];

db.agents.insert(agents);
