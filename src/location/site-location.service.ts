import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteLocation, SiteLocationDocument } from '../location/schemas/site-location.schema';
import { v4 as uuidv4 } from 'uuid';

export const formatResponse = (
  status: 'success' | 'error',
  statusCode: number,
  message: string,
  data: any = null
) => ({
  status,
  statusCode,
  message,
  data,
});

@Injectable()
export class SiteLocationService {
  constructor(
    @InjectModel(SiteLocation.name) private siteLocationModel: Model<SiteLocationDocument>,
  ) { }

  async getAll(): Promise<any> {
    try {
      const locations = await this.siteLocationModel.find().exec();
      return formatResponse('success', 200, 'Site locations retrieved successfully', locations);
    } catch (error) {
      return formatResponse('error', 500, 'Failed to retrieve site locations', error.message);
    }
  }

  async get(id: string): Promise<any> {
    try {
      const locations = await this.siteLocationModel.findById(id);
      if (locations) {
        return formatResponse('success', 200, 'Site found', locations);
      } else {
        return formatResponse('error', 201, 'Failed to retrieve site locations', "Site not found");
      }
    } catch (error) {
      return formatResponse('error', 500, 'Failed to retrieve site locations', error.message);
    }
  }

  async getByName(name: string): Promise<any> {
    try {
      const locations = await this.siteLocationModel.findOne({ name });
      if (locations) {
        return formatResponse('success', 200, 'Site found', locations);
      } else {
        return formatResponse('error', 201, 'Failed to retrieve site locations', "Site not found");
      }
    } catch (error) {
      return formatResponse('error', 500, 'Failed to retrieve site locations', error.message);
    }
  }

  async registerSiteLocation(
    siteName: string,
    sitePolygon: { lat: number; lng: number }[],
  ): Promise<any> {
    try {
      const newLocation = new this.siteLocationModel({
        id: uuidv4(),
        siteName,
        sitePolygon,
      });
      const savedLocation = await newLocation.save();
      return formatResponse('success', 201, 'Site location registered successfully', savedLocation);
    } catch (error) {
      return formatResponse('error', 500, 'Failed to register site location', error.message);
    }
  }
}
