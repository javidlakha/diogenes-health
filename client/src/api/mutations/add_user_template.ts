import { gql } from "@apollo/client"

export const ADD_USER_TEMPLATE = gql`
  mutation add_user_template(
    $name: String!
    $sections: [UserTemplateSectionInput]!
  ) {
    add_user_template(input: { name: $name, sections: $sections }) {
      template_identifier
    }
  }
`
