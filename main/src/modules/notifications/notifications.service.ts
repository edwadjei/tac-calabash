import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async getAnnouncements(ministryId?: string) {
    return this.prisma.announcement.findMany({
      where: {
        isPublished: true,
        ...(ministryId ? { ministryId } : {}),
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
      },
      include: { ministry: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async createAnnouncement(data: any) {
    return this.prisma.announcement.create({
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });
  }

  async send(data: { title: string; body: string; type: string; recipients?: string[] }) {
    // Store notification
    const notification = await this.prisma.notification.create({
      data: {
        title: data.title,
        body: data.body,
        type: data.type as any,
      },
    });

    // TODO: Implement push notification sending via Expo Push API
    // TODO: Implement email sending for email-type notifications

    return notification;
  }

  async registerDevice(data: { memberId: string; token: string; platform: string }) {
    return this.prisma.deviceToken.upsert({
      where: { token: data.token },
      update: { memberId: data.memberId, platform: data.platform },
      create: data,
    });
  }
}
