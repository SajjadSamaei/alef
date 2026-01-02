import { cookies } from "next/headers";
import { unstable_cache } from "next/cache"; // For caching local API calls
import { BannerData } from "./types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { LandingBanner as BannerComponent } from "./landing-banner-client";

// ... other imports and BannerData interface

// V V V THIS IS THE DATA FETCHING FUNCTION V V V
const getBannerData = unstable_cache(
  async (): Promise<BannerData | null> => {
    try {
      const payload = await getPayload({ config: configPromise });
      // This line communicates directly with Payload to get the data
      const banner = await payload.findGlobal({
        slug: "landing-banner",
      });
      return banner as unknown as BannerData;
    } catch (error) {
      console.error("Failed to fetch banner data via Local API:", error);
      return null;
    }
  },
  ["banner_data"], // A unique key for this cached function
  {
    tags: ["landing-page-banner"], // The tag for on-demand revalidation
  },
);

// ^ ^ ^ THIS IS THE DATA FETCHING FUNCTION ^ ^ ^

export default async function LandingBanner() {
  // V V V AND HERE IS WHERE IT GETS CALLED V V V
  const banner = await getBannerData();
  const now = new Date();
  const startDate = banner?.campaignStartDate
    ? new Date(banner.campaignStartDate)
    : null;
  const endDate = banner?.campaignEndDate
    ? new Date(banner.campaignEndDate)
    : null;

  const isWithinDateRange =
    (!startDate || now >= startDate) && (!endDate || now <= endDate);

  const cookieStore = await cookies();
  const dismissedVersion = cookieStore.get("landing-page-banner")?.value;
  const isDismissed = dismissedVersion === banner?.updatedAt;

  const showBanner =
    banner?.active && // Must be manually activated
    isWithinDateRange && // Must be within the date range
    !isDismissed;

  return <>{showBanner && <BannerComponent data={banner} />}</>;
}
