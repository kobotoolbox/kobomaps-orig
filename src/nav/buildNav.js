import $ from '../jquery';
import toggleActive from './toggleActive';
import { indicatorsToUpdateParams } from '../init';

export default function buildNav(data) {
    const $navMenuTemplate = $('<li><span/><ul/></li>'),
        $indicatorTemplate = $('<li class="level3"><a/></li>');

    let $uls = $(),
        $spans = $(),
        $indicators = $();
    const $questionIndicators = $("#questionsindicators");

    Object.keys(data).forEach(function (firstLevelName, firstLevelIndex){
        const $firstLevel = $navMenuTemplate.clone(),
            $firstLevelUl = $firstLevel.find('ul'),
            $firstLevelSpan = $firstLevel.find('span');

        $firstLevel.contents().andSelf().addClass('level1');
        $uls = $uls.add($firstLevelUl);
        $spans = $spans.add($firstLevelSpan);

        $firstLevelSpan.text(firstLevelName);

        Object.keys(data[firstLevelName]).forEach(function (secondLevelName, secondLevelIndex) {
            const $secondLevel = $navMenuTemplate.clone(),
                $secondLevelUl = $secondLevel.find('ul'),
                $secondLevelSpan = $secondLevel.find('span');

            $uls= $uls.add($secondLevelUl);
            $spans = $spans.add($secondLevelSpan);

            $secondLevel.contents().andSelf().addClass('level2');

            $secondLevelSpan.text(secondLevelName);

            Object.keys(data[firstLevelName][secondLevelName]).forEach(function (indicatorName, indicatorIndex) {
                const $indicator = $indicatorTemplate.clone(),
                    key = firstLevelIndex + '_' + secondLevelIndex + '_' + indicatorIndex;

                indicatorsToUpdateParams[key] = data[firstLevelName][secondLevelName][indicatorName];
                $indicator.attr('id', 'bottom_level_' + firstLevelIndex + '_' + secondLevelIndex + '_'  + indicatorIndex);
                $indicator.find('a').attr('href', '#/?indicator='+ key).text(indicatorName);
                $secondLevelUl.append($indicator);

                $indicator.click(function (){
                    // resets nav state
                    $indicators.removeClass("active");
                    $uls.hide();
                    $spans.removeClass("active");

                    // since state was reset, needs to activate path to indicator
                    $secondLevelSpan.addClass("active");
                    $firstLevelSpan.addClass("active");
                    $indicator.addClass("active");
                    $secondLevelUl.show();
                    $firstLevelUl.show();
                });

                $indicators = $indicators.add($indicator);
            });
            $firstLevelUl.append($secondLevel);
        });

        $questionIndicators.append($firstLevel);
    });

    $spans.click(function () {
        toggleActive($(this));
    });

    $uls.hide();


    $spans.hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}
