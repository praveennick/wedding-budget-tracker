export const formatNumberWithCommas = (value) => {
    if (value === "" || value === null || value === undefined) return "";

    const number = Number(value);
    if (isNaN(number)) return "";

    return number.toLocaleString("en-IN");
};

export const removeCommas = (value) => {
    return value.replace(/,/g, "");
};