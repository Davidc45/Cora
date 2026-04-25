// src/app/components/markerIcons.ts

export const categoryIconMap: Record<number, string> = {
    1: "/assets/report-robbery-icon.png",
    2: "/assets/report-traffic-icon.png",
    3: "/assets/report-assault-icon.png",
    4: "/assets/report-suspicious-icon.png",
    5: "/assets/report-vandalism-icon.png",
    6: "/assets/report-hazard-icon.png",
    7: "/assets/report-other-icon.png",
};

export function getCategoryIcon(categoryId: number | null | undefined): string {
    if (!categoryId) return "/assets/report-other-icon.png";
    return categoryIconMap[categoryId] ?? "/assets/report-other-icon.png";
}

export function createMarkerContent(iconUrl: string, color: string): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "report-marker";

    wrapper.innerHTML = `
    <div class="report-marker-pin" style="background:${color}">
        <div class="report-marker-glyph">
        <img src="${iconUrl}" alt="" />
        </div>
    </div>
    `;

    return wrapper;
}