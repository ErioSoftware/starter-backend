import { BadRequestException } from '@nestjs/common';

const normalizeDirection = {
  asc: 'ASC',
  desc: 'DESC',
};

export const getOrder = (orderStr: string) => {
  if (orderStr.split(':').length !== 2)
    throw new BadRequestException('Bad order string');
  const [key, direction] = orderStr.split(':');
  return { [key]: normalizeDirection[direction] };
};
