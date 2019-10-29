export const handleItemListChange = (name, value) => ({
  type: `ITEM_LIST_CHANGED_${name}`,
  value,
});
