import { Link } from 'react-router-dom';
import './Breadcrumb.css';

export type BreadcrumbItem = {
  label: string;
  path?: string;
  icon?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: string;
};

const DEFAULT_SEPARATOR = '/';

export function Breadcrumb({ items, separator = DEFAULT_SEPARATOR }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const itemKey = `${index}-${item.label}`;
          return (
            <li key={itemKey} className="breadcrumb-item">
              {!isLast && item.path ? (
                <Link to={item.path} className="breadcrumb-link">
                  {item.icon ? (
                    <span className="breadcrumb-icon">{item.icon}</span>
                  ) : null}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    'breadcrumb-text' + (isLast ? ' breadcrumb-current' : '')
                  }
                >
                  {item.icon ? (
                    <span className="breadcrumb-icon">{item.icon}</span>
                  ) : null}
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span className="breadcrumb-separator">{separator}</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
