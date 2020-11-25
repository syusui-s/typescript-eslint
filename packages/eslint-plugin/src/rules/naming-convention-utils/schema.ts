import { JSONSchema } from '@typescript-eslint/experimental-utils';
import {
  IndividualAndMetaSelectorsString,
  MetaSelectors,
  Modifiers,
  ModifiersString,
  PredefinedFormats,
  Selectors,
  TypeModifiers,
  UnderscoreOptions,
} from './enums';
import * as util from '../../util';

const UNDERSCORE_SCHEMA: JSONSchema.JSONSchema4 = {
  type: 'string',
  enum: util.getEnumNames(UnderscoreOptions),
};
const PREFIX_SUFFIX_SCHEMA: JSONSchema.JSONSchema4 = {
  type: 'array',
  items: {
    type: 'string',
    minLength: 1,
  },
  additionalItems: false,
};
const MATCH_REGEX_SCHEMA: JSONSchema.JSONSchema4 = {
  type: 'object',
  properties: {
    match: { type: 'boolean' },
    regex: { type: 'string' },
  },
  required: ['match', 'regex'],
};
type JSONSchemaProperties = Record<string, JSONSchema.JSONSchema4>;
const FORMAT_OPTIONS_PROPERTIES: JSONSchemaProperties = {
  format: {
    oneOf: [
      {
        type: 'array',
        items: {
          type: 'string',
          enum: util.getEnumNames(PredefinedFormats),
        },
        additionalItems: false,
      },
      {
        type: 'null',
      },
    ],
  },
  custom: MATCH_REGEX_SCHEMA,
  leadingUnderscore: UNDERSCORE_SCHEMA,
  trailingUnderscore: UNDERSCORE_SCHEMA,
  prefix: PREFIX_SUFFIX_SCHEMA,
  suffix: PREFIX_SUFFIX_SCHEMA,
  failureMessage: {
    type: 'string',
  },
};
function selectorSchema(
  selectorString: IndividualAndMetaSelectorsString,
  allowType: boolean,
  modifiers?: ModifiersString[],
): JSONSchema.JSONSchema4[] {
  const selector: JSONSchemaProperties = {
    filter: {
      oneOf: [
        {
          type: 'string',
          minLength: 1,
        },
        MATCH_REGEX_SCHEMA,
      ],
    },
    selector: {
      type: 'string',
      enum: [selectorString],
    },
  };
  if (modifiers && modifiers.length > 0) {
    selector.modifiers = {
      type: 'array',
      items: {
        type: 'string',
        enum: modifiers,
      },
      additionalItems: false,
    };
  }
  if (allowType) {
    selector.types = {
      type: 'array',
      items: {
        type: 'string',
        enum: util.getEnumNames(TypeModifiers),
      },
      additionalItems: false,
    };
  }

  return [
    {
      type: 'object',
      properties: {
        ...FORMAT_OPTIONS_PROPERTIES,
        ...selector,
      },
      required: ['selector', 'format'],
      additionalProperties: false,
    },
  ];
}

function selectorsSchema(): JSONSchema.JSONSchema4 {
  return {
    type: 'object',
    properties: {
      ...FORMAT_OPTIONS_PROPERTIES,
      ...{
        filter: {
          oneOf: [
            {
              type: 'string',
              minLength: 1,
            },
            MATCH_REGEX_SCHEMA,
          ],
        },
        selector: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              ...util.getEnumNames(MetaSelectors),
              ...util.getEnumNames(Selectors),
            ],
          },
          additionalItems: false,
        },
        modifiers: {
          type: 'array',
          items: {
            type: 'string',
            enum: util.getEnumNames(Modifiers),
          },
          additionalItems: false,
        },
        types: {
          type: 'array',
          items: {
            type: 'string',
            enum: util.getEnumNames(TypeModifiers),
          },
          additionalItems: false,
        },
      },
    },
    required: ['selector', 'format'],
    additionalProperties: false,
  };
}

const SCHEMA: JSONSchema.JSONSchema4 = {
  type: 'array',
  items: {
    oneOf: [
      selectorsSchema(),
      ...selectorSchema('default', false, util.getEnumNames(Modifiers)),

      ...selectorSchema('variableLike', false, ['unused']),
      ...selectorSchema('variable', true, [
        'const',
        'destructured',
        'global',
        'exported',
        'unused',
      ]),
      ...selectorSchema('function', false, ['global', 'exported', 'unused']),
      ...selectorSchema('parameter', true, ['unused']),

      ...selectorSchema('memberLike', false, [
        'private',
        'protected',
        'public',
        'static',
        'readonly',
        'abstract',
        'requiresQuotes',
      ]),
      ...selectorSchema('classProperty', true, [
        'private',
        'protected',
        'public',
        'static',
        'readonly',
        'abstract',
        'requiresQuotes',
      ]),
      ...selectorSchema('objectLiteralProperty', true, [
        'private',
        'protected',
        'public',
        'static',
        'readonly',
        'abstract',
        'requiresQuotes',
      ]),
      ...selectorSchema('typeProperty', true, [
        'private',
        'protected',
        'public',
        'static',
        'readonly',
        'abstract',
        'requiresQuotes',
      ]),
      ...selectorSchema('parameterProperty', true, [
        'private',
        'protected',
        'public',
        'readonly',
      ]),
      ...selectorSchema('property', true, [
        'private',
        'protected',
        'public',
        'static',
        'readonly',
        'abstract',
        'requiresQuotes',
      ]),

      ...selectorSchema('classMethod', false, [
        'private',
        'protected',
        'public',
        'static',
        'abstract',
        'requiresQuotes',
      ]),
      ...selectorSchema('objectLiteralMethod', false, [
        'private',
        'protected',
        'public',
        'static',
        'abstract',
        'requiresQuotes',
      ]),
      ...selectorSchema('typeMethod', false, [
        'private',
        'protected',
        'public',
        'static',
        'abstract',
        'requiresQuotes',
      ]),
      ...selectorSchema('method', false, [
        'private',
        'protected',
        'public',
        'static',
        'abstract',
        'requiresQuotes',
      ]),
      ...selectorSchema('accessor', true, [
        'private',
        'protected',
        'public',
        'static',
        'abstract',
        'requiresQuotes',
      ]),
      ...selectorSchema('enumMember', false, ['requiresQuotes']),

      ...selectorSchema('typeLike', false, ['abstract', 'exported', 'unused']),
      ...selectorSchema('class', false, ['abstract', 'exported', 'unused']),
      ...selectorSchema('interface', false, ['exported', 'unused']),
      ...selectorSchema('typeAlias', false, ['exported', 'unused']),
      ...selectorSchema('enum', false, ['exported', 'unused']),
      ...selectorSchema('typeParameter', false, ['unused']),
    ],
  },
  additionalItems: false,
};

export { SCHEMA };