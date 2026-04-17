import { Link } from 'react-router-dom';

export type BreadcrumbItem = {
  label: string;
  path?: string;
  icon?: string;
};

type Props = {
  items: BreadcrumbItem[];
  separator?: string;
};

export function Breadcrumb({ items, separator = '/' }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="users__breadcrumb-nav">
      <ol className="users__breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="users__breadcrumb-item">
              {!isLast && item.path ? (
                <Link to={item.path} className="users__breadcrumb-link">
                  {item.icon && (
                    <span className="users__breadcrumb-icon">{item.icon}</span>
                  )}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`users__breadcrumb-text${isLast ? ' users__breadcrumb-current' : ''}`}
                >
                  {item.icon && (
                    <span className="users__breadcrumb-icon">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="users__breadcrumb-separator">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
