import mongoose from 'mongoose';

export async function aggregateData(
  collections: mongoose.Model<any>[],
  aggregationPeriod: Date,
  saveToCollection: mongoose.Model<any>,
) {
  try {
    const aggregation = await Promise.all(
      collections.map((collection) =>
        collection.aggregate([
          {
            $group: {
              _id: null,
              avgCpuLoad: {
                $avg: {
                  $ifNull: ['$avgCpuLoad', '$load'],
                },
              },
              avgDiskUsage: {
                $avg: {
                  $ifNull: ['$avgDiskUsage', '$usage'],
                },
              },
              anomalyCountCpu: {
                $sum: {
                  $ifNull: ['$anomalyCountCpu', '$anomalyCpu'],
                },
              },
              anomalyCountDisk: {
                $sum: {
                  $ifNull: ['$anomalyCountDisk', '$anomalyDisk'],
                },
              },
            },
          },
        ]),
      ),
    );

    const data = aggregation.reduce(
      (acc, cur) => {
        if (cur.length > 0) {
          const aggData = cur[0];
          acc.avgCpuLoad += aggData.avgCpuLoad || 0;
          acc.avgDiskUsage += aggData.avgDiskUsage || 0;
          acc.anomalyCountCpu += aggData.anomalyCountCpu || 0;
          acc.anomalyCountDisk += aggData.anomalyCountDisk || 0;
        }
        return acc;
      },
      {
        avgCpuLoad: 0,
        avgDiskUsage: 0,
        anomalyCountCpu: 0,
        anomalyCountDisk: 0,
      },
    );

    const aggregateDocument = new saveToCollection({
      timestamp: aggregationPeriod,
      avgCpuLoad: data.avgCpuLoad,
      avgDiskUsage: data.avgDiskUsage,
      anomalyCountCpu: data.anomalyCountCpu,
      anomalyCountDisk: data.anomalyCountDisk,
    });

    await aggregateDocument.save();
  } catch (error) {
    console.error('Error during aggregation', error);
  }
}
