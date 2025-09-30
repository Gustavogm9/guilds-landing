-- Add business_unit column to crm_deals table
ALTER TABLE crm_deals 
ADD COLUMN business_unit TEXT;

-- Add comment to document the column
COMMENT ON COLUMN crm_deals.business_unit IS 'Qual negócio: guilds, guilds_lab, guilds_craft, doavya, outros';