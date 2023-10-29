import { gql } from "@apollo/client"

export const CREATE_TEMPLATE = gql`
  mutation create_template(
    $name: String!
    $public: Boolean!
    $sections: [TemplateSectionInput]!
  ) {
    create_template(name: $name, public: $public, sections: $sections) {
      template_identifier
    }
  }
`
