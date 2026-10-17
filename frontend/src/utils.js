export const COLORS = ["#2dd4bf", "#3b82f6", "#818cf8", "#4ade80", "#fb923c", "#f472b6", "#facc15"];

export function money(n) {
    return "₹" + Number(n || 0).toLocaleString("en-IN");
}

//same name always get same color
export function colorFor(name = "") {
    let hash = 0;
    for(const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) %1000 ;
    return COLORS[hash % COLORS.length];
}