---
layout:     post
title:      黑白天气的小小CustomView
subtitle:   用于显示相关天气温度之类的数据的控件
date:       2019-1-24
author:     theVan
header-img: img/post-bg-android.jpg
catalog: true
tags:
    - android
    - java
    - Git
---

> 仕事のため、一生懸命頑張ります。

> 随心的笔记

# 概述

感觉应用显示温度数据的时候直接就干巴巴地跳出来了，打算做一个控件用来给温度加点特技。

### 自定义属性

```
    <declare-styleable name="WeatherTempTextView">
        <!--动画持续的时间-->
        <attr name="durationTime" format="integer|reference"/>
        <!--动画插值器的类型-->
        <attr name="interpolatorType" >
            <enum name="LinearInterpolator" value="0"/>
            <enum name="DecelerateInterpolator" value="1"/>
            <enum name="BounceInterpolator" value="2"/>
        </attr>
        <!--单位-->
        <attr name="unit" format="string|reference"/>
    </declare-styleable>
```
由于主要是用来显示温度，需要单位“ ° ”，索性除了与动画相关的属性之外把单位加到自定义属性中，以适应不同的单位。
插值器的话，三个已经够用了，因为速度太快，基本上是看不出区别的。

### Java代码

```
   	public WeatherTempTextView(Context context, AttributeSet attrs) {
        super(context, attrs);

        /* 获取自定义的属性 */
        TypedArray typedArray = context.obtainStyledAttributes(attrs,
                R.styleable.WeatherTempTextView);
        // 获取自定以的单位，没有定义的话给空字符
        if (typedArray.hasValue(R.styleable.WeatherTempTextView_unit)) {
            mUnit = typedArray.getString(R.styleable.WeatherTempTextView_unit);
        } else {
            mUnit = ""; // 没有的话默认不赋值
        }
        // 获取自定义的插值器类型，没有定义的话设为线性插值器
        if (typedArray.hasValue(R.styleable.WeatherTempTextView_interpolatorType)) {
            mInterpolatorType = typedArray.getIndex(R.styleable.WeatherTempTextView_interpolatorType);
        } else {
            mInterpolatorType = DEFAULT_LINEARINTERPOLATOR;
        }
        // 获取自定义的动画时间，没有定义的话设为2s。
        mDuration = typedArray.getInt(R.styleable.WeatherTempTextView_interpolatorType,
                DEFAULT_DURATION);

        /* 设置属性动画 */
        mAnimator = ValueAnimator.ofFloat(ANIMATOR_START_VALUE, ANIMATOR_END_VALUE);
        mAnimator.setRepeatCount(ANIMATION_REPEAT_COUNT);
        initInterpolatorWithCode(mInterpolatorType);
        mAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                // 根据动画当前的进度计算当前该显示的值
                float curValue = (float)animation.getAnimatedValue() * mValue;
                setText(String.format("%.0f", curValue) + mUnit);
            }
        });
    }
```

### 效果
demo的效果：
![demo](img/d95_test_1.gif)
加入到黑白天气中的效果：
![black](img/d95_test_2.gif)

