Coruscant = new physicalScreen({
    model: 'coruscant',
    version: 1.0,
    serial: 0,
    type: 'rectangular',
    dimensions: new THREE.Vector2(40, 30),  // in millimeters
    resolutionOfDisplay: new THREE.Vector2(1600, 1200),
    numberOfViews: new THREE.Vector2(8, 8);
//    aspectRatio: 4/3 = dimensions.x/dimensions.y,
//    resolutionOfViews: new THREE.Vector2(200, 150),
    emissionPatternR : [
            new THREE.Vector2(-0.47103,-0.25196),  new THREE.Vector2(0.32553,-0.25761),  new THREE.Vector2(0.19416,-0.25919),  new THREE.Vector2(0.075195,-0.2648),   new THREE.Vector2(-0.036818,-0.26364),  new THREE.Vector2(-0.1477,-0.26071),   new THREE.Vector2(-0.25989,-0.26018),  new THREE.Vector2(-0.36332,-0.25364),
            new THREE.Vector2(-0.47338,-0.14268),  new THREE.Vector2(0.32579,-0.14765),  new THREE.Vector2(0.19618,-0.15125),  new THREE.Vector2(0.078519,-0.15257),  new THREE.Vector2(-0.038459,-0.15057),  new THREE.Vector2(-0.14838,-0.15084),  new THREE.Vector2(-0.26192,-0.14749),  new THREE.Vector2(-0.36674,-0.14588),
            new THREE.Vector2(-0.47524,-0.033906), new THREE.Vector2(0.32412,-0.03549),  new THREE.Vector2(0.19818,-0.037849), new THREE.Vector2(0.076951,-0.036707), new THREE.Vector2(-0.035873,-0.036395), new THREE.Vector2(-0.15161,-0.035988), new THREE.Vector2(-0.26098,-0.036494), new THREE.Vector2(-0.36588,-0.03338),
            new THREE.Vector2(-0.47126,0.074103),  new THREE.Vector2(0.32387,0.075532),  new THREE.Vector2(0.19498,0.075072),  new THREE.Vector2(0.079448,0.078672),  new THREE.Vector2(-0.038724,0.078673),  new THREE.Vector2(-0.14889,0.078945),   new THREE.Vector2(-0.2634,0.077235),   new THREE.Vector2(-0.36519,0.075861),
            new THREE.Vector2(-0.46896,0.18185),   new THREE.Vector2(0.31968,0.18917),   new THREE.Vector2(0.19483,0.18608),   new THREE.Vector2(0.074316,0.19054),   new THREE.Vector2(-0.036115,0.19151),   new THREE.Vector2(-0.1504,0.19073),    new THREE.Vector2(-0.25973,0.19042),   new THREE.Vector2(-0.3622,0.18612),
            new THREE.Vector2(-0.46072,0.28883),   new THREE.Vector2(0.31719,0.29499),   new THREE.Vector2(0.19035,0.30028),   new THREE.Vector2(0.078287,0.30377),   new THREE.Vector2(-0.039087,0.30318),   new THREE.Vector2(-0.14503,0.30246),   new THREE.Vector2(-0.25676,0.29901),   new THREE.Vector2(-0.35728,0.29479),
            new THREE.Vector2(-0.4499,0.40841),    new THREE.Vector2(0.31173,0.42138),   new THREE.Vector2(0.18482,0.42711),   new THREE.Vector2(0.073039,0.43311),   new THREE.Vector2(-0.039412,0.43152),   new THREE.Vector2(-0.1449,0.42984),     new THREE.Vector2(-0.25272,0.4258),    new THREE.Vector2(-0.35193,0.41897),
            new THREE.Vector2(-0.45978,-0.36686),  new THREE.Vector2(0.31229,-0.38441),  new THREE.Vector2(0.1849,-0.3899),    new THREE.Vector2(0.07221,-0.39371),   new THREE.Vector2(-0.040258,-0.3919),   new THREE.Vector2(-0.14843,-0.39121),  new THREE.Vector2(-0.258,-0.38458),    new THREE.Vector2(-0.35877,-0.37804)
    ],
    emissionPatternG : [
            new THREE.Vector2(-0.47103,-0.25196),  new THREE.Vector2(0.32553,-0.25761),  new THREE.Vector2(0.19416,-0.25919),  new THREE.Vector2(0.075195,-0.2648),   new THREE.Vector2(-0.036818,-0.26364),  new THREE.Vector2(-0.1477,-0.26071),   new THREE.Vector2(-0.25989,-0.26018),  new THREE.Vector2(-0.36332,-0.25364),
            new THREE.Vector2(-0.47338,-0.14268),  new THREE.Vector2(0.32579,-0.14765),  new THREE.Vector2(0.19618,-0.15125),  new THREE.Vector2(0.078519,-0.15257),  new THREE.Vector2(-0.038459,-0.15057),  new THREE.Vector2(-0.14838,-0.15084),  new THREE.Vector2(-0.26192,-0.14749),  new THREE.Vector2(-0.36674,-0.14588),
            new THREE.Vector2(-0.47524,-0.033906), new THREE.Vector2(0.32412,-0.03549),  new THREE.Vector2(0.19818,-0.037849), new THREE.Vector2(0.076951,-0.036707), new THREE.Vector2(-0.035873,-0.036395), new THREE.Vector2(-0.15161,-0.035988), new THREE.Vector2(-0.26098,-0.036494), new THREE.Vector2(-0.36588,-0.03338),
            new THREE.Vector2(-0.47126,0.074103),  new THREE.Vector2(0.32387,0.075532),  new THREE.Vector2(0.19498,0.075072),  new THREE.Vector2(0.079448,0.078672),  new THREE.Vector2(-0.038724,0.078673),  new THREE.Vector2(-0.14889,0.078945),   new THREE.Vector2(-0.2634,0.077235),   new THREE.Vector2(-0.36519,0.075861),
            new THREE.Vector2(-0.46896,0.18185),   new THREE.Vector2(0.31968,0.18917),   new THREE.Vector2(0.19483,0.18608),   new THREE.Vector2(0.074316,0.19054),   new THREE.Vector2(-0.036115,0.19151),   new THREE.Vector2(-0.1504,0.19073),    new THREE.Vector2(-0.25973,0.19042),   new THREE.Vector2(-0.3622,0.18612),
            new THREE.Vector2(-0.46072,0.28883),   new THREE.Vector2(0.31719,0.29499),   new THREE.Vector2(0.19035,0.30028),   new THREE.Vector2(0.078287,0.30377),   new THREE.Vector2(-0.039087,0.30318),   new THREE.Vector2(-0.14503,0.30246),   new THREE.Vector2(-0.25676,0.29901),   new THREE.Vector2(-0.35728,0.29479),
            new THREE.Vector2(-0.4499,0.40841),    new THREE.Vector2(0.31173,0.42138),   new THREE.Vector2(0.18482,0.42711),   new THREE.Vector2(0.073039,0.43311),   new THREE.Vector2(-0.039412,0.43152),   new THREE.Vector2(-0.1449,0.42984),     new THREE.Vector2(-0.25272,0.4258),    new THREE.Vector2(-0.35193,0.41897),
            new THREE.Vector2(-0.45978,-0.36686),  new THREE.Vector2(0.31229,-0.38441),  new THREE.Vector2(0.1849,-0.3899),    new THREE.Vector2(0.07221,-0.39371),   new THREE.Vector2(-0.040258,-0.3919),   new THREE.Vector2(-0.14843,-0.39121),  new THREE.Vector2(-0.258,-0.38458),    new THREE.Vector2(-0.35877,-0.37804)
    ],
    emissionPatternB : [
            new THREE.Vector2(-0.47103,-0.25196),  new THREE.Vector2(0.32553,-0.25761),  new THREE.Vector2(0.19416,-0.25919),  new THREE.Vector2(0.075195,-0.2648),   new THREE.Vector2(-0.036818,-0.26364),  new THREE.Vector2(-0.1477,-0.26071),   new THREE.Vector2(-0.25989,-0.26018),  new THREE.Vector2(-0.36332,-0.25364),
            new THREE.Vector2(-0.47338,-0.14268),  new THREE.Vector2(0.32579,-0.14765),  new THREE.Vector2(0.19618,-0.15125),  new THREE.Vector2(0.078519,-0.15257),  new THREE.Vector2(-0.038459,-0.15057),  new THREE.Vector2(-0.14838,-0.15084),  new THREE.Vector2(-0.26192,-0.14749),  new THREE.Vector2(-0.36674,-0.14588),
            new THREE.Vector2(-0.47524,-0.033906), new THREE.Vector2(0.32412,-0.03549),  new THREE.Vector2(0.19818,-0.037849), new THREE.Vector2(0.076951,-0.036707), new THREE.Vector2(-0.035873,-0.036395), new THREE.Vector2(-0.15161,-0.035988), new THREE.Vector2(-0.26098,-0.036494), new THREE.Vector2(-0.36588,-0.03338),
            new THREE.Vector2(-0.47126,0.074103),  new THREE.Vector2(0.32387,0.075532),  new THREE.Vector2(0.19498,0.075072),  new THREE.Vector2(0.079448,0.078672),  new THREE.Vector2(-0.038724,0.078673),  new THREE.Vector2(-0.14889,0.078945),   new THREE.Vector2(-0.2634,0.077235),   new THREE.Vector2(-0.36519,0.075861),
            new THREE.Vector2(-0.46896,0.18185),   new THREE.Vector2(0.31968,0.18917),   new THREE.Vector2(0.19483,0.18608),   new THREE.Vector2(0.074316,0.19054),   new THREE.Vector2(-0.036115,0.19151),   new THREE.Vector2(-0.1504,0.19073),    new THREE.Vector2(-0.25973,0.19042),   new THREE.Vector2(-0.3622,0.18612),
            new THREE.Vector2(-0.46072,0.28883),   new THREE.Vector2(0.31719,0.29499),   new THREE.Vector2(0.19035,0.30028),   new THREE.Vector2(0.078287,0.30377),   new THREE.Vector2(-0.039087,0.30318),   new THREE.Vector2(-0.14503,0.30246),   new THREE.Vector2(-0.25676,0.29901),   new THREE.Vector2(-0.35728,0.29479),
            new THREE.Vector2(-0.4499,0.40841),    new THREE.Vector2(0.31173,0.42138),   new THREE.Vector2(0.18482,0.42711),   new THREE.Vector2(0.073039,0.43311),   new THREE.Vector2(-0.039412,0.43152),   new THREE.Vector2(-0.1449,0.42984),     new THREE.Vector2(-0.25272,0.4258),    new THREE.Vector2(-0.35193,0.41897),
            new THREE.Vector2(-0.45978,-0.36686),  new THREE.Vector2(0.31229,-0.38441),  new THREE.Vector2(0.1849,-0.3899),    new THREE.Vector2(0.07221,-0.39371),   new THREE.Vector2(-0.040258,-0.3919),   new THREE.Vector2(-0.14843,-0.39121),  new THREE.Vector2(-0.258,-0.38458),    new THREE.Vector2(-0.35877,-0.37804)
    ],
    emissionIntensityR : [
        16.8257,  10.1279,  20.5381,  17.8361,  17.1073,  18.6971,  18.703,   19.3744,
        16.4487,  10.1035,  22.2759,  19.0143,  17.4514,  18.9238,  19.1239,  19.3068,
        15.6264,   9.9234,  22.1389,  19.8558,  17.2363,  18.7993,  19.1507,  19.1572,
        15.9622,  10.3031,  22.9754,  20.4721,  17.9748,  19.4602,  19.6189,  19.4387,
        15.6704,  10.3478,  22.4275,  20.0733,  18.7477,  20.2247,  19.9613,  19.6013,
        15.6612,  10.3109,  20.5876,  19.5173,  19.2796,  20.3138,  19.9369,  19.3843,
        10.1941,   6.6193,  11.541,   11.579,   11.8551,  12.6437,  12.403,   12.509,
        13.1737,   7.639,   12.8601,  11.9956,  12.4294,  12.9773,  13.4724,  14.203
    ],
    emissionIntensityG : [
        16.8257,  10.1279,  20.5381,  17.8361,  17.1073,  18.6971,  18.703,   19.3744,
        16.4487,  10.1035,  22.2759,  19.0143,  17.4514,  18.9238,  19.1239,  19.3068,
        15.6264,   9.9234,  22.1389,  19.8558,  17.2363,  18.7993,  19.1507,  19.1572,
        15.9622,  10.3031,  22.9754,  20.4721,  17.9748,  19.4602,  19.6189,  19.4387,
        15.6704,  10.3478,  22.4275,  20.0733,  18.7477,  20.2247,  19.9613,  19.6013,
        15.6612,  10.3109,  20.5876,  19.5173,  19.2796,  20.3138,  19.9369,  19.3843,
        10.1941,   6.6193,  11.541,   11.579,   11.8551,  12.6437,  12.403,   12.509,
        13.1737,   7.639,   12.8601,  11.9956,  12.4294,  12.9773,  13.4724,  14.203
    ],
    emissionIntensityB : [
        16.8257,  10.1279,  20.5381,  17.8361,  17.1073,  18.6971,  18.703,   19.3744,
        16.4487,  10.1035,  22.2759,  19.0143,  17.4514,  18.9238,  19.1239,  19.3068,
        15.6264,   9.9234,  22.1389,  19.8558,  17.2363,  18.7993,  19.1507,  19.1572,
        15.9622,  10.3031,  22.9754,  20.4721,  17.9748,  19.4602,  19.6189,  19.4387,
        15.6704,  10.3478,  22.4275,  20.0733,  18.7477,  20.2247,  19.9613,  19.6013,
        15.6612,  10.3109,  20.5876,  19.5173,  19.2796,  20.3138,  19.9369,  19.3843,
        10.1941,   6.6193,  11.541,   11.579,   11.8551,  12.6437,  12.403,   12.509,
        13.1737,   7.639,   12.8601,  11.9956,  12.4294,  12.9773,  13.4724,  14.203
    ],
    emissionGaussianR: [],
    emissionGaussianG: [],
    emissionGaussianB: [],
});

