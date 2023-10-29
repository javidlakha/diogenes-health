import { gql } from "@apollo/client"

export const UPDATE_TEMPLATE = gql`
  mutation update_template(
    $name: String!
    $public: Boolean!
    $sections: [TemplateSectionInput]!
    $template_identifier: ID!
  ) {
    update_template(
      name: $name
      public: $public
      sections: $sections
      template_identifier: $template_identifier
    ) {
      template_identifier
    }
  }
`
