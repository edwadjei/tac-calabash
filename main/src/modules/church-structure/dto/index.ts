import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty({ example: 'Accra District' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  headquarterAssemblyId?: string;
}

export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {}

export class CreateCircuitDto {
  @ApiProperty({ example: 'Circuit 1' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  districtId: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  headquarterAssemblyId?: string;
}

export class UpdateCircuitDto extends PartialType(CreateCircuitDto) {}

export class CreateAssemblyDto {
  @ApiProperty({ example: 'Calabash Assembly' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  circuitId: string;
}

export class UpdateAssemblyDto extends PartialType(CreateAssemblyDto) {}

export class CreatePositionDto {
  @ApiProperty({ example: 'Elder' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'Lead assembly elder' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePositionDto extends PartialType(CreatePositionDto) {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
