import { useQuery } from "@apollo/client"
import Skeleton from "react-loading-skeleton"
import { Link, useNavigate } from "react-router-dom"
import "react-loading-skeleton/dist/skeleton.css"

import { TEMPLATES } from "api/queries/templates"
import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { Navigation } from "components/Navigation/Navigation"
import { CREATE_NEW_TEMPLATE } from "constants/template"
import { TemplateMetadata } from "types"
import "./home.css"

export function Homepage() {
  const navigate = useNavigate()
  const { data, loading } = useQuery(TEMPLATES)
  const templates: TemplateMetadata[] = data?.templates || []

  return (
    <>
      <Navigation />
      <div className="page">
        <div className="home-text">Document a</div>
        <div className="home-templates">
          {loading
            ? [...Array(12)].map((_, idx) => (
                <div
                  className="home-template"
                  key={`template-skeleton-${idx}`}
                >
                  <Skeleton
                    baseColor="#dee2e6"
                    borderRadius="0"
                    count={2}
                  />
                </div>
              ))
            : templates
                .sort((a, b) => a.name.trim().localeCompare(b.name.trim()))
                .map((template) => (
                  <div
                    className="home-template"
                    key={template.template_identifier}
                    onClick={() => {
                      navigate(`create/${template.template_identifier}/`)
                    }}
                  >
                    {template.name}
                  </div>
                ))}
        </div>
        <div className="home-text">
          Or{" "}
          <Link to={`/templates/user/${CREATE_NEW_TEMPLATE}`}>
            create a new template
          </Link>
          .
        </div>
        <div className="home-legal-text">
          <div>
            <Link
              rel="noopener noreferrer"
              target="_blank"
              to="/terms-of-use"
            >
              Terms of Use
            </Link>
            .
          </div>
          <div>
            <Link
              rel="noopener noreferrer"
              target="_blank"
              to="/privacy-policy"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </>
  )
}
