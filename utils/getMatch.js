module.exports = (text, reg, index) => {
    const match = text.match(reg);

    return match ? match[index] : null;
};
