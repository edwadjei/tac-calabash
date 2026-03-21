import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, EventQueryDto, EventResponse } from './dto';

@ApiTags('Events')
@ApiBearerAuth('access-token')
@Controller('events')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all events',
    description: 'Retrieve a list of events with optional date range and filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of events retrieved successfully',
    type: [EventResponse],
  })
  findAll(@Query() query: EventQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get event by ID',
    description: 'Retrieve detailed information about a specific event.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Event found successfully',
    type: EventResponse,
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new event',
    description: 'Create a new church or ministry event.',
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update event',
    description: 'Update an existing event\'s information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: EventResponse,
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete event',
    description: 'Permanently delete an event.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
    type: EventResponse,
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.remove(id);
  }
}
