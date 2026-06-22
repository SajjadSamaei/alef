export type PublicSiteSettings = {
  contact?: {
    email?: string | null;
    phone?: string | null;
    mobilePhones?: { number?: string | null }[] | null;
    officeName?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    workingHours?: string | null;
  } | null;
  social?: {
    whatsapp?: string | null;
    telegram?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    facebook?: string | null;
    x?: string | null;
  } | null;
  pages?: {
    portfolio?: boolean | null;
    services?: boolean | null;
    process?: boolean | null;
    about?: boolean | null;
    blog?: boolean | null;
    contact?: boolean | null;
    team?: boolean | null;
  } | null;
};
