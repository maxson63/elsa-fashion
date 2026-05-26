const SI = require('./models/SI');

// Test the SI class and the fixed _collect_factor_and_dimension method
const si = new SI();

console.log('Testing SI class and _collect_factor_and_dimension method...\n');

// Test 1: Basic unit with dimensions
console.log('Test 1: Basic unit with dimensions');
const meter = {
    name: 'meter',
    symbol: 'm',
    factor: 1,
    dimensions: { length: 1 }
};

const result1 = si._collect_factor_and_dimension(meter);
console.log('Result:', result1);
console.log('Expected: factor=1, dimensions={length: 1}, dimensionString="L", isBaseUnit=true\n');

// Test 2: Unit with zero exponent (should be filtered out)
console.log('Test 2: Unit with zero exponent (BUG FIX TEST)');
const unitWithZero = {
    name: 'test unit',
    symbol: 'tu',
    factor: 1,
    dimensions: { length: 1, mass: 0, time: 0 }
};

const result2 = si._collect_factor_and_dimension(unitWithZero);
console.log('Result:', result2);
console.log('Expected: mass and time should be filtered out (zero exponents)\n');

// Test 3: Complex derived unit
console.log('Test 3: Complex derived unit');
const newton = {
    name: 'newton',
    symbol: 'N',
    factor: 1,
    dimensions: { length: 1, mass: 1, time: -2 }
};

const result3 = si._collect_factor_and_dimension(newton);
console.log('Result:', result3);
console.log('Expected: dimensionString with negative exponent handled correctly\n');

// Test 4: Dimensionless unit
console.log('Test 4: Dimensionless unit');
const radian = {
    name: 'radian',
    symbol: 'rad',
    factor: 1,
    dimensions: {}
};

const result4 = si._collect_factor_and_dimension(radian);
console.log('Result:', result4);
console.log('Expected: isDimensionless=true, dimensionString="1"\n');

// Test 5: Unit conversion using the fixed method
console.log('Test 5: Unit conversion');
const kilometer = {
    name: 'kilometer',
    symbol: 'km',
    factor: 1000,
    dimensions: { length: 1 }
};

try {
    const converted = si.convert(5, kilometer, meter);
    console.log('5 km =', converted, 'm');
    console.log('Expected: 5000 m\n');
} catch (error) {
    console.log('Conversion error:', error.message);
}

// Test 6: Invalid unit validation
console.log('Test 6: Unit validation');
const invalidUnit = {
    name: 'invalid',
    symbol: 'inv',
    dimensions: { length: 'invalid' } // Invalid exponent
};

console.log('Valid unit (meter):', si.validate_unit(meter));
console.log('Invalid unit:', si.validate_unit(invalidUnit));

console.log('\nAll tests completed!');
