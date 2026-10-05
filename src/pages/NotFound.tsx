import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui";

export default function NotFound() {
  return (
    <div className="px-4 py-16">
      <EmptyState
        title="Page not found"
        message="The link may be broken, or the page may have moved."
        action={
          <Link to="/" className="btn btn-primary">
            Go to home
          </Link>
        }
      />
    </div>
  );
}
