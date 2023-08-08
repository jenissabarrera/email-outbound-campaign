import { useState, useEffect } from "react";
import { getCampaign } from "../../utils/GenesysCloudUtils.tsx";

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [campaignId, setCampaignId] = useState("");

  const selectCampaign = (selectedId: string) => {
    setCampaignId(selectedId);
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const fetchedCampaigns = await getCampaign();
        if (fetchedCampaigns && Array.isArray(fetchedCampaigns.entities)) {
          setCampaigns(fetchedCampaigns.entities);
        } else {
          console.error("Campaigns data is not an array");
        }
      } catch (error) {
        console.error("Error while fetching campaigns", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return { campaigns, isLoading, campaignId, selectCampaign };
};
