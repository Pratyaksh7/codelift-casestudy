export type InventoryAlertProps = {
  lowStockCount: number;
};

export function InventoryAlert({ lowStockCount }: InventoryAlertProps) {
  if (lowStockCount <= 0) return null;
  const isPlural = lowStockCount > 1;
  return (
    <div className="inventory-page__alert">
      <span className="inventory-page__alert-icon">&#9888;</span>
      <strong>
        {lowStockCount} product{isPlural ? 's' : ''}
      </strong>{' '}
      {isPlural ? 'have' : 'has'} low or zero stock levels.
    </div>
  );
}

export default InventoryAlert;
