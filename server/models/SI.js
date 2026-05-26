/**
 * SI (International System of Units) class for handling unit conversions and dimension analysis
 */
class SI {
    constructor() {
        this.baseDimensions = {
            length: 'L',
            mass: 'M', 
            time: 'T',
            electric_current: 'I',
            thermodynamic_temperature: 'Θ',
            amount_of_substance: 'N',
            luminous_intensity: 'J'
        };
        
        this.derivedDimensions = {
            force: 'LMT⁻²',
            energy: 'L²MT⁻²',
            power: 'L²MT⁻³',
            pressure: 'L⁻¹MT⁻²',
            frequency: 'T⁻¹',
            voltage: 'L²MT⁻³I⁻¹',
            resistance: 'L²MT⁻³I⁻²',
            capacitance: 'L⁻²M⁻¹T⁴I²'
        };
    }

    /**
     * Collects factor and dimension information for unit analysis
     * BUG: The original method had issues with dimension collection where:
     * 1. Dimensions were not being properly normalized
     * 2. Zero dimensions were being included in results
     * 3. Negative exponents were not being handled correctly
     * 
     * @param {Object} unit - Unit object with properties like name, symbol, dimensions
     * @returns {Object} Object containing factor and dimension information
     */
    _collect_factor_and_dimension(unit) {
        const result = {
            factor: unit.factor || 1,
            dimensions: {},
            dimensionString: '',
            isBaseUnit: false,
            isDimensionless: false
        };

        // Handle case where unit has no dimensions (dimensionless)
        if (!unit.dimensions || Object.keys(unit.dimensions).length === 0) {
            result.isDimensionless = true;
            result.dimensionString = '1';
            return result;
        }

        // Process dimensions and normalize them
        const processedDimensions = {};
        
        for (const [dimension, exponent] of Object.entries(unit.dimensions)) {
            // Skip zero exponents (BUG FIX: was including them before)
            if (exponent === 0) {
                continue;
            }
            
            // Validate dimension exists in our system
            if (!this.baseDimensions[dimension] && !this.derivedDimensions[dimension]) {
                console.warn(`Unknown dimension: ${dimension}`);
                continue;
            }
            
            processedDimensions[dimension] = exponent;
        }

        result.dimensions = processedDimensions;

        // Check if it's a base unit (single dimension with exponent 1)
        const dimensionKeys = Object.keys(processedDimensions);
        if (dimensionKeys.length === 1 && processedDimensions[dimensionKeys[0]] === 1) {
            result.isBaseUnit = true;
        }

        // Build dimension string (BUG FIX: improved handling of negative exponents)
        result.dimensionString = this._build_dimension_string(processedDimensions);

        return result;
    }

    /**
     * Helper method to build dimension string from dimensions object
     * @param {Object} dimensions - Dimensions object with exponents
     * @returns {string} Formatted dimension string
     */
    _build_dimension_string(dimensions) {
        if (Object.keys(dimensions).length === 0) {
            return '1';
        }

        const parts = [];
        
        // Sort dimensions for consistent output
        const sortedDimensions = Object.entries(dimensions).sort(([a], [b]) => a.localeCompare(b));
        
        for (const [dimension, exponent] of sortedDimensions) {
            const symbol = this.baseDimensions[dimension] || dimension;
            
            if (exponent === 1) {
                parts.push(symbol);
            } else if (exponent > 0) {
                parts.push(`${symbol}${exponent > 0 ? exponent : ''}`);
            } else {
                // BUG FIX: properly handle negative exponents
                parts.push(`${symbol}${exponent}`);
            }
        }

        return parts.join('·');
    }

    /**
     * Validates if a unit object is properly formatted
     * @param {Object} unit - Unit object to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validate_unit(unit) {
        if (!unit || typeof unit !== 'object') {
            return false;
        }

        // Check required fields
        if (!unit.name || !unit.symbol) {
            return false;
        }

        // Validate dimensions if present
        if (unit.dimensions) {
            for (const [dimension, exponent] of Object.entries(unit.dimensions)) {
                if (typeof exponent !== 'number' || !isFinite(exponent)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Converts between units using factor and dimension analysis
     * @param {number} value - Value to convert
     * @param {Object} fromUnit - Source unit
     * @param {Object} toUnit - Target unit
     * @returns {number} Converted value
     */
    convert(value, fromUnit, toUnit) {
        const fromInfo = this._collect_factor_and_dimension(fromUnit);
        const toInfo = this._collect_factor_and_dimension(toUnit);

        // Check if units are compatible (same dimensions)
        if (fromInfo.dimensionString !== toInfo.dimensionString) {
            throw new Error(`Cannot convert between incompatible units: ${fromUnit.symbol} -> ${toUnit.symbol}`);
        }

        // Perform conversion using factors
        const convertedValue = (value * fromInfo.factor) / toInfo.factor;
        return convertedValue;
    }
}

module.exports = SI;
