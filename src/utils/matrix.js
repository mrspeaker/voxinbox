var matrix = {
    mult: function(A, B) {

        function MH(A, B) {
            var Sum = 0;
            for (var i = 0; i < A.length; i++) {
                Sum += A[i] * B[i];
            }
            return Sum;
        }

        var A1 = [A[0], A[1], A[2], A[3]];
            A2 = [A[4], A[5], A[6], A[7]],
            A3 = [A[8], A[9], A[10], A[11]],
            A4 = [A[12], A[13], A[14], A[15]],
            B1 = [B[0], B[4], B[8], B[12]],
            B2 = [B[1], B[5], B[9], B[13]],
            B3 = [B[2], B[6], B[10], B[14]],
            B4 = [B[3], B[7], B[11], B[15]];
    return [
        MH(A1, B1), MH(A1, B2), MH(A1, B3), MH(A1, B4),
        MH(A2, B1), MH(A2, B2), MH(A2, B3), MH(A2, B4),
        MH(A3, B1), MH(A3, B2), MH(A3, B3), MH(A3, B4),
        MH(A4, B1), MH(A4, B2), MH(A4, B3), MH(A4, B4)];
    },

    inverse: function(A) {
        var s0 = A[0] * A[5] - A[4] * A[1];
        var s1 = A[0] * A[6] - A[4] * A[2];
        var s2 = A[0] * A[7] - A[4] * A[3];
        var s3 = A[1] * A[6] - A[5] * A[2];
        var s4 = A[1] * A[7] - A[5] * A[3];
        var s5 = A[2] * A[7] - A[6] * A[3];
        var c5 = A[10] * A[15] - A[14] * A[11];
        var c4 = A[9] * A[15] - A[13] * A[11];
        var c3 = A[9] * A[14] - A[13] * A[10];
        var c2 = A[8] * A[15] - A[12] * A[11];
        var c1 = A[8] * A[14] - A[12] * A[10];
        var c0 = A[8] * A[13] - A[12] * A[9];
        var invdet = 1.0 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);
        var B = [];
        B[0] = ( A[5] * c5 - A[6] * c4 + A[7] * c3) * invdet;
        B[1] = (-A[1] * c5 + A[2] * c4 - A[3] * c3) * invdet;
        B[2] = ( A[13] * s5 - A[14] * s4 + A[15] * s3) * invdet;
        B[3] = (-A[9] * s5 + A[10] * s4 - A[11] * s3) * invdet;
        B[4] = (-A[4] * c5 + A[6] * c2 - A[7] * c1) * invdet;
        B[5] = ( A[0] * c5 - A[2] * c2 + A[3] * c1) * invdet;
        B[6] = (-A[12] * s5 + A[14] * s2 - A[15] * s1) * invdet;
        B[7] = ( A[8] * s5 - A[10] * s2 + A[11] * s1) * invdet;
        B[8] = ( A[4] * c4 - A[5] * c2 + A[7] * c0) * invdet;
        B[9] = (-A[0] * c4 + A[1] * c2 - A[3] * c0) * invdet;
        B[10] = ( A[12] * s4 - A[13] * s2 + A[15] * s0) * invdet;
        B[11] = (-A[8] * s4 + A[9] * s2 - A[11] * s0) * invdet;
        B[12] = (-A[4] * c3 + A[5] * c1 - A[6] * c0) * invdet;
        B[13] = ( A[0] * c3 - A[1] * c1 + A[2] * c0) * invdet;
        B[14] = (-A[12] * s3 + A[13] * s1 - A[14] * s0) * invdet;
        B[15] = ( A[8] * s3 - A[9] * s1 + A[10] * s0) * invdet;
        return B;
    },

    transpose: function(A) {
        return [
            A[0], A[4], A[8], A[12],
            A[1], A[5], A[9], A[13],
            A[2], A[6], A[10], A[14],
            A[3], A[7], A[11], A[15]
        ];
    },

    perspective: function(FOV, aspectRatio, closest, furthest){
        var yLimit = closest * Math.tan(FOV * Math.PI / 360),
            a = -(furthest + closest) / (furthest - closest),
            b = -2 * furthest * closest / (furthest - closest),
            c = (2 * closest) / ((yLimit * aspectRatio) * 2),
            d = (2 * closest) / (yLimit * 2);
        return [
            c, 0, 0, 0,
            0, d, 0, 0,
            0, 0, a, -1,
            0, 0, b, 0
        ];
    },

    rotateTransform: function(obj, rotation){
        var rot = rotation || obj.rotation || 0,
            y = rot * (Math.PI / 180.0),
            a = Math.cos(y);
            b = -1 * Math.sin(y);
            c = Math.sin(y);
            d = Math.cos(y);
        return [
            a, 0, b, 0,
            0, 1, 0, 0,
            c, 0, d, 0,
            0, 0, -6, 1
        ];
    }
}