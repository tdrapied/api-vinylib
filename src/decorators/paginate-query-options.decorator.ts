import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

// Link: https://github.com/ppetzold/nestjs-paginate/issues/173#issuecomment-1270333358

export function PaginateQueryOptions() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (starting from 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of records per page',
      example: 25,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Multicolumn search term',
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      description:
        'Format: _field_:_direction_ [direction may be ASC or DESC] e.g. id:DESC',
    }),
  );
}
