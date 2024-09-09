export const showMagLinkName = (link) => {
    const dnMatch = link.match(/dn=([^&]*)/);
    return dnMatch ? dnMatch[1] : link.split("&")[0];
};
