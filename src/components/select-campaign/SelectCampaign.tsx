import React from "react";

interface Props {
  campaigns: any[];
  selectCampaign: (id: string) => void;
}

const SelectCampaign: React.FC<Props> = ({ campaigns, selectCampaign }) => (
  <div>
    <select onChange={(e) => selectCampaign(e.target.value)}>
      <option>Select a Campaign</option>
      {campaigns.map((campaign) => (
        <option key={campaign.id} value={campaign.id}>
          {campaign.name}
        </option>
      ))}
    </select>
  </div>
);

export default SelectCampaign;
