import {test, expect} from '@playwright/test'
import { customTest } from '../utils/fixture'

customTest("Fixture test", async ({ authenticatedPage, goalsRetirementFeature, goalsGetApi }) => {
    const goalCardHeader = await authenticatedPage
     .getByRole("heading", { name: /^(Retirement|Emergency fund|College savings)$/ })
     .allTextContents();
   
      
   
       const title = await goalsGetApi.map(goalsGetApi => goalsGetApi.title);

      expect(goalsRetirementFeature.monthlyContribution).toBe(500);
   
       expect(goalCardHeader).toEqual(title);
   
       //Map
       const goalId = goalsGetApi.map(goalsGetApi => goalsGetApi.target);
   
       expect(goalId[1]).toBe(20000);
   
       //Set
       const detectDuplicateTargetAmount = new Set(goalId);
   
       expect(goalId.length).toEqual(detectDuplicateTargetAmount.size);
   
   
       //Map key, value
       const goalsById = new Map(goalsGetApi.map(goal => [goal.id, goal]));
       const retirementGoal = goalsById.get('retirement');
   
       expect(retirementGoal.target).toBe(500000);
})