import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Domain3 from '../lib/domain3-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Domain3.Domain3Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
