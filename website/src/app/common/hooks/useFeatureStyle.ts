/**
 * @file common/useFeatureStyle
 * @author dingyang
 */

// feature-style样式
export default (featureStyle: String) => {
    const styleItems = featureStyle.split(',');
    const [, $borderColor, , , $fillColor] = styleItems;

    const borderColorWithout$ = $borderColor.substr(1);
    let formatBorderColor = '';
    for (let i = (borderColorWithout$.length - 2); i >= 2; i = i - 2) {
        const prefixColor = borderColorWithout$[i];
        const suffixColor = borderColorWithout$[i + 1];
        formatBorderColor += `${prefixColor}${suffixColor}`;
    }
    const borderColor = `#${formatBorderColor}`;

    const fillColorWithout$ = $fillColor.substr(1);
    let formatFillColor = '';
    for (let i = (fillColorWithout$.length - 2); i >= 2; i = i - 2) {
        const prefixColor = fillColorWithout$[i];
        const suffixColor = fillColorWithout$[i + 1];
        formatFillColor += `${prefixColor}${suffixColor}`;
    }
    const fillColor = `#${formatFillColor}`;

    return {
        borderColor,
        fillColor
    };
};
