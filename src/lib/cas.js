import { XMLParser } from 'fast-xml-parser';

const CAS_URL = process.env.CAS_BASE_URL || 'https://sso.ui.ac.id/cas2';

// URL Login SSO UI
export function getCasLoginUrl(serviceCallbackUrl) {
    return `${CAS_URL}/login?service=${encodeURIComponent(serviceCallbackUrl)}`;
}

// URL Logout SSO UI
export function getCasLogoutUrl(redirectUrl) {
    return `${CAS_URL}/logout?service=${encodeURIComponent(redirectUrl)}`;
}

// Validating CAS Ticket to SSO UI
export async function validateCasTicket(ticket, serviceCallbackUrl) {
    const validateUrl = `${CAS_URL}/serviceValidate?ticket=${encodeURIComponent(ticket)}&service=${encodeURIComponent(serviceCallbackUrl)}`;

    const response = await fetch(validateUrl);

    if (!response.ok) {
        throw new Error(`Gagal menghubungi server SSO UI: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parser = new XMLParser({
        ignoreAttributes: false,
        removeNSPrefix: true, // Removes CAS Prefix
    });

    const parsed = parser.parse(xmlText);
    const serviceResponse = parsed.serviceResponse;

    if (serviceResponse?.authenticationSuccess) {
        const success = serviceResponse.authenticationSuccess;
        const attributes = success.attributes || {};

        return {
            success: true,
            username: success.user,
            npm: attributes.npm || attributes.nomor_identitas || success.user,
            name: attributes.nama || attributes.ldap_cn || null,
            rawAttributes: attributes,
        };
    }

    return {
        success: false,
        error: serviceResponse?.authenticationFailure?.['#text'] || 'Tiket SSO tidak valid',
    };
}