let PRICING = {
    standard:   { shirt: 30, pant: 40, tshirt: 25, dress: 50, cottonDress: 60 },
    premium:    { shirt: 50, pant: 60, tshirt: 40, dress: 80, cottonDress: 100 },
    "dry cleaning": { shirt: 80, pant: 90, tshirt: 70, dress: 120, cottonDress: 140 },
    delicate:   { shirt: 100, pant: 110, tshirt: 90, dress: 150, cottonDress: 170 }
};

module.exports = {
    getPricing: () => PRICING,
    setPricing: (type, prices) => { PRICING[type] = prices; },
    addWashType: (type, prices) => { PRICING[type] = prices; },
    removeWashType: (type) => { delete PRICING[type]; }
};