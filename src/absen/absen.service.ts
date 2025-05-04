import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { formatResponse, SiteLocationService } from 'src/location/site-location.service';
import { v4 as uuidv4 } from 'uuid';
import { Absensi, AbsensiDocument } from './schemas/absensi.schema';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApprovalData, CreateAbsensiDto } from './dto/absensi.dto';
import { Media } from 'src/cloudinary/schemas/media.schema';
import { Role, User, UserDocument } from 'src/auth/model/user.model';
import { FcmService } from 'src/firebase/fcm/fcm.service';

@Injectable()
export class AbsensiService {
    constructor(
        @InjectModel('Absensi') private absensiModel: Model<AbsensiDocument>,
        @InjectModel('Media') private mediaModel: Model<Media>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private cloudinaryService: CloudinaryService,
        private readonly fcmService: FcmService,
    ) { }


    // TODO: Make API to send FCM if user open the APP and if the regular absensi is more than certain hours it will trigger the API from flutter but from BE it will send notification to the user
    // Additional: After user open the app, it will getUserAbsensiList then check the latest absensi status. if status is not end then trigger the API to send notification to the user
    // More Addition: If the lemburan is approved and the user still not start the lembur, need API also to send notification to the user to remind to start the lembur
    async getUserAbsensiList(
        accountId: string,
        startDate?: Date,
        endDate?: Date,
        type: 'all' | 'lembur' | 'reguler' = 'all',
        page = 1,
        limit = 25,
    ): Promise<any> {
        try {
            const query: any = { accountId };

            // Date range filter
            if (startDate && endDate) {
                query.startDate = { $gte: startDate, $lte: endDate };
            } else if (startDate) {
                query.startDate = { $gte: startDate };
            } else if (endDate) {
                query.startDate = { $lte: endDate };
            }

            // Type filter
            if (type === 'lembur') {
                query.isOverTime = true;
            } else if (type === 'reguler') {
                query.isOverTime = false;
            }

            // Pagination
            const skip = (page - 1) * limit;
            const [totalCount, items] = await Promise.all([
                this.absensiModel.countDocuments(query),
                this.absensiModel.find(query).skip(skip).limit(limit).lean(),
            ]);

            const isMax = skip + items.length >= totalCount;

            return formatResponse('success', 200, 'Absensi list retrieved successfully', {
                items,
                page,
                limit,
                totalCount,
                isMax,
            });
        } catch (error) {
            return formatResponse('error', 500, 'Failed to retrieve absensi list', error.message);
        }
    }

    async getAbsensiListForAdmin(
        startDate?: Date,
        endDate?: Date,
        type: 'all' | 'lembur' | 'reguler' = 'all',
        page = 1,
        limit = 25,
    ): Promise<any> {
        try {
            const query: any = {};

            // Date range filter
            if (startDate && endDate) {
                query.startDate = { $gte: startDate, $lte: endDate };
            } else if (startDate) {
                query.startDate = { $gte: startDate };
            } else if (endDate) {
                query.startDate = { $lte: endDate };
            }

            // Type filter
            if (type === 'lembur') {
                query.isOverTime = true;
            } else if (type === 'reguler') {
                query.isOverTime = false;
            }

            // Pagination
            const skip = (page - 1) * limit;
            const [totalCount, items] = await Promise.all([
                this.absensiModel.countDocuments(query),
                this.absensiModel.find(query).skip(skip).limit(limit).lean(),
            ]);

            const isMax = skip + items.length >= totalCount;

            return formatResponse('success', 200, 'Absensi list retrieved successfully', {
                items,
                page,
                limit,
                totalCount,
                isMax,
            });
        } catch (error) {
            return formatResponse('error', 500, 'Failed to retrieve absensi list', error.message);
        }
    }




    async getUserAbsensi(accountId: string, absensiId: string): Promise<any> {
        try {
            const absensi = await this.absensiModel.findById(absensiId).exec();
            if (!absensi) {
                return formatResponse('error', 404, 'Absensi not found');
            }
            return formatResponse('success', 200, 'Absensi retrieved successfully', absensi);
        } catch (error) {
            return formatResponse('error', 500, 'Failed to retrieve absensi', error.message);
        }
    }

    async absenMasuk(
        accountId: string,
        absensiDto: CreateAbsensiDto,
        startImgFile?: Express.Multer.File
    ): Promise<any> {
        // Handle lemburan flow so that if user submit absensi masuk it will trigger FCM to send notification to admin
        try {
            let startImgId: string | undefined;
            let startImgUrl: string | undefined;

            const user = await this.userModel.findById(accountId);
            if (!user) {
                return formatResponse('error', 404, 'User not found');
            }

            // If there is an image, upload it and store in Media collection
            if (startImgFile) {
                const uploadResult = await this.cloudinaryService.uploadImageMasuk(startImgFile).catch(() => null);
                if (!uploadResult) {
                    return formatResponse('error', 500, 'Image upload failed, absensi not added');
                }

                // Save Media document
                const newMedia = new this.mediaModel({
                    assetId: uploadResult.asset_id,
                    publicId: uploadResult.public_id,
                    version: uploadResult.version,
                    versionId: uploadResult.version_id,
                    signature: uploadResult.signature,
                    width: uploadResult.width,
                    height: uploadResult.height,
                    format: uploadResult.format,
                    resourceType: uploadResult.resource_type,
                    createdAt: uploadResult.created_at,
                    bytes: uploadResult.bytes,
                    type: uploadResult.type,
                    etag: uploadResult.etag,
                    placeholder: uploadResult.placeholder,
                    url: uploadResult.url,
                    secureUrl: uploadResult.secure_url,
                    assetFolder: uploadResult.asset_folder,
                    displayName: uploadResult.display_name,
                    originalFilename: uploadResult.original_filename,
                });

                const savedMedia = await newMedia.save();
                startImgId = savedMedia._id.toString();
                startImgUrl = savedMedia.url.toString();
            }

            if (typeof absensiDto.startPosition === "string") {
                absensiDto.startPosition = JSON.parse(absensiDto.startPosition);
            }

            // Create absensi only if the image (if provided) is uploaded successfully
            const newAbsensi = new this.absensiModel({
                id: uuidv4(),
                accountId,
                ...absensiDto,
                startImgId,
                startImgUrl,
            });

            // if lemburan send FCM to admin

            const savedAbsensi = await newAbsensi.save();

            let pjoList = await this.userModel.find(
                { 'site._id': user.site._id, role: Role.PJO },
                { fullName: 1, role: 1, fcmToken: 1 }
            );

            let managerList = await this.userModel.find(
                { role: Role.Manager },
                { fullName: 1, role: 1, fcmToken: 1 }
            );

            let hrdList = await this.userModel.find(
                { 'site._id': user.site._id, role: Role.HRD },
                { fullName: 1, role: 1, fcmToken: 1 }
            );

            let adminList = await this.userModel.find(
                { role: Role.Admin },
                { fullName: 1, role: 1, fcmToken: 1 }
            );

            let combinedSuperior = [
                ...pjoList,
                ...managerList,
                ...hrdList,
                ...adminList,
            ];


            if (absensiDto.isOverTime) {
                await Promise.all(combinedSuperior.map(superior =>
                    this.fcmService.sendNotification(
                        superior.fcmToken,
                        `Pengajuan Lembur dari ${user.fullName}`,
                        `Hai ${superior.fullName}, ${user.fullName} telah mengajukan lembur.`,
                        {
                            'absensiId': savedAbsensi._id.toString(),
                            'route': 'detail-absensi',
                            'type': 'lembur',
                            'userId': user._id.toString(),
                        },
                    )
                ));
            }

            return formatResponse('success', 201, 'Absensi added successfully', savedAbsensi);
        } catch (error) {
            return formatResponse('error', 500, 'Failed to add absensi', error.message);
        }
    }

    async absenKeluar(
        absensiDto: CreateAbsensiDto,
        endImgFile?: Express.Multer.File,
        absensiId?: string,
    ): Promise<any> {
        try {
            let endImgId: string | undefined;
            let endImgUrl: string | undefined;

            const existedAbsen = await this.absensiModel.findById(absensiId);

            if (!existedAbsen) {
                return formatResponse('error', 404, 'Absensi not found');
            }

            // If there is an image, upload it and store in Media collection
            if (endImgFile) {
                const uploadResult = await this.cloudinaryService.uploadImageKeluar(endImgFile).catch(() => null);
                if (!uploadResult) {
                    return formatResponse('error', 500, 'Image upload failed, absensi not updated');
                }

                // Save Media document
                const newMedia = new this.mediaModel({
                    assetId: uploadResult.asset_id,
                    publicId: uploadResult.public_id,
                    version: uploadResult.version,
                    versionId: uploadResult.version_id,
                    signature: uploadResult.signature,
                    width: uploadResult.width,
                    height: uploadResult.height,
                    format: uploadResult.format,
                    resourceType: uploadResult.resource_type,
                    createdAt: uploadResult.created_at,
                    bytes: uploadResult.bytes,
                    type: uploadResult.type,
                    etag: uploadResult.etag,
                    placeholder: uploadResult.placeholder,
                    url: uploadResult.url,
                    secureUrl: uploadResult.secure_url,
                    assetFolder: uploadResult.asset_folder,
                    displayName: uploadResult.display_name,
                    originalFilename: uploadResult.original_filename,
                });

                const savedMedia = await newMedia.save();
                endImgId = savedMedia._id.toString();
                endImgUrl = savedMedia.url.toString();
            }

            if (typeof absensiDto.endPosition === "string") {
                absensiDto.endPosition = JSON.parse(absensiDto.endPosition);
            }

            // Update the existing absensi document
            existedAbsen.endPosition = absensiDto.endPosition as any;
            existedAbsen.endImgId = endImgId;
            existedAbsen.endImgUrl = endImgUrl;
            existedAbsen.endDate = absensiDto.endDate;
            existedAbsen.remarks = absensiDto.remarks;

            const updatedAbsensi = await existedAbsen.save();
            return formatResponse('success', 200, 'Absensi updated successfully', updatedAbsensi);
            // return formatResponse('success', 201, 'Absensi edited successfully');
        } catch (error) {
            return formatResponse('error', 500, 'Failed to add absensi', error.message);
        }
    }

    async actionLemburan(absensiId: string, approvalData: ApprovalData): Promise<any> {
        try {
            const absensi = await this.absensiModel.findOne({ id: absensiId });
            if (!absensi) {
                return formatResponse('error', 404, 'Absensi not found');
            }

            const user = await this.userModel.findById(absensi.accountId);
            if (!user) {
                return formatResponse('error', 404, 'User not found');
            }

            const updateField: Record<string, any> = {};

            switch (approvalData.role) {
                case 'pjo':
                    updateField.pjoApproval = approvalData;
                    break;
                case 'manager':
                    updateField.managerApproval = approvalData;
                    break;
                case 'hrd':
                    updateField.hrdApproval = approvalData;
                    break;
                default:
                    return formatResponse('error', 400, 'Invalid role submitted');
            }

            const updatedAbsensi = await this.absensiModel.findOneAndUpdate(
                { id: absensiId },
                { $set: updateField },
                { new: true }
            );

            if (updatedAbsensi.isOverTime) {
                let stats = approvalData.approvalStatus;
                this.fcmService.sendNotification(
                    user.fcmToken,
                    `Pengajuan Lembur anda ${stats === 'approved' ? 'disetujui' : 'ditolak'}`,
                    `Hai ${user.fullName}, pengajuan lembur anda telah ${stats === 'approved' ? 'disetujui' : 'ditolak'} oleh ${approvalData.role} ${approvalData.role === Role.PJO ? 'permohonan lemburan akan dilanjutkan ke manager' : 'selamat bekerja!'}.`,
                    {
                        'absensiId': updateField._id.toString(),
                        'route': 'detail-absensi',
                        'type': 'lembur',
                        'userId': user._id.toString(),
                        'status': approvalData.approvalStatus,
                    },
                );
                if (approvalData.role === Role.PJO && approvalData.approvalStatus === 'approved') {
                    let managerList = await this.userModel.find(
                        { role: Role.Manager },
                        { fullName: 1, role: 1, fcmToken: 1 }
                    );
                    await Promise.all(managerList.map(superior =>
                        this.fcmService.sendNotification(
                            superior.fcmToken,
                            `Pengajuan Lembur dari ${user.fullName}`,
                            `Hai ${superior.fullName}, ${user.fullName} telah mengajukan lembur.`,
                            {
                                'absensiId': updatedAbsensi._id.toString(),
                                'route': 'detail-absensi',
                                'type': 'lembur',
                                'userId': user._id.toString(),
                            },
                        )
                    ));
                }
            }

            return formatResponse('success', 200, 'Lemburan approval updated', updatedAbsensi);
        } catch (error) {
            return formatResponse('error', 500, 'Failed to update approval', error.message);
        }
    }

}

